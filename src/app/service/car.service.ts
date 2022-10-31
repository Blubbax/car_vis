import { Car } from './../model/car';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

    // Inital car data table
    public cars: Observable<Car[]>;
    private carsSubject: BehaviorSubject<any>;
    private carRawData: Car[] = [];
    private carDataTable: Car[] = [];

    private viewid = 0;

    public attributes: string[] = ['riskFactor', 'make', 'fuelType', 'aspiration', 'numOfDoors', 'bodyStyle', 'driveWheels', 'engineLocation', 'wheelBase', 'length', 'width', 'height', 'curbWeight', 'numOfCylinders', 'engineSize', 'fuelSystem', 'compressionRatio', 'horsepower', 'peakRpm', 'cityMpg', 'highwayMpg', 'price'];
    public categoricalAttributes: string[] = ['make', 'fuelType', 'aspiration', 'bodyStyle', 'driveWheels', 'engineLocation', 'engineType', 'fuelSystem'] ;

    // Data Tables for different visualization stages
    public attributeExplorerSelection: Observable<Car[]>;
    private attributeExplorerSelectionSubject: BehaviorSubject<any>;

    public parallelCoordinatesSelection: Observable<Car[]>;
    private parallelCoordinatesSelectionSubject: BehaviorSubject<any>;

    public scatterPlotSelection: Observable<Car[]>;
    private scatterPlotSelectionSubject: BehaviorSubject<any>;

    // Hovered/Selected Car
    public selectedCar: Observable<Car>;
    private selectedCarSubject: BehaviorSubject<any>;

    constructor(private httpClient: HttpClient) {

        this.carsSubject = new BehaviorSubject<Car[]>(this.carRawData);
        this.cars = this.carsSubject.asObservable();

        this.selectedCarSubject = new BehaviorSubject<Car | undefined>(undefined);
        this.selectedCar = this.selectedCarSubject.asObservable();

        this.attributeExplorerSelectionSubject = new BehaviorSubject<Car[]>([]);
        this.attributeExplorerSelection = this.attributeExplorerSelectionSubject.asObservable();

        this.parallelCoordinatesSelectionSubject = new BehaviorSubject<Car[]>([]);
        this.parallelCoordinatesSelection = this.parallelCoordinatesSelectionSubject.asObservable();

        this.scatterPlotSelectionSubject = new BehaviorSubject<Car[]>([]);
        this.scatterPlotSelection = this.scatterPlotSelectionSubject.asObservable();


        const headers = new HttpHeaders({
            Accept: 'text/csv',
        });

        this.httpClient.get<any>('assets/cars.csv', { headers, responseType: 'text' as any })
            .subscribe(result => {
                var dataObjects = result.split('\n');

                // filter attributes
                dataObjects.splice(0, 1);

                dataObjects.forEach((carString: string) => {
                    const carData = carString.split(',');

                    // Filter when horesepower or price missing as these are two important attributes
                    // and num of doors and cylinders as these has to be converted to a number
                    if (((carData[21] !== undefined && carData[21].trim()) !== "?")
                      && (carData[25] !== undefined && carData[25].trim() !== '?')
                      && (carData[5] !== undefined && carData[5].trim() !== "?")
                      && (carData[15] !== undefined && carData[15].trim() !== "?")) {

                      const car: Car = {
                          riskFactor: parseInt(carData[0]),
                          //normalizedLosses: parseInt(carData[1]),
                          make: carData[2],
                          fuelType: carData[3],
                          aspiration: carData[4],
                          numOfDoors: this.numberStringToInt(carData[5]),
                          bodyStyle: carData[6],
                          driveWheels: carData[7],
                          engineLocation: carData[8],
                          wheelBase: parseInt(carData[9]),
                          length: parseInt(carData[10]),
                          width: parseInt(carData[11]),
                          height: parseInt(carData[12]),
                          curbWeight: parseInt(carData[13]),
                          //engineType: carData[14],
                          numOfCylinders: this.numberStringToInt(carData[15]),
                          engineSize: parseInt(carData[16]),
                          fuelSystem: carData[17],
                          //bore: parseInt(carData[18]),
                          //stroke: parseInt(carData[19]),
                          compressionRatio: parseInt(carData[20]),
                          horsepower: parseInt(carData[21]),
                          peakRpm: parseInt(carData[22]),
                          cityMpg: parseInt(carData[23]),
                          highwayMpg: parseInt(carData[24]),
                          price: parseInt(carData[25])
                      };
                      this.carRawData.push(car);

                    } else {
                      console.log("Filter" + carData[25])
                    }


                });

                console.log("Have fun with cars: " + this.carRawData.length)
                this.carRawData.pop(); // Last element not a real car
                this.carDataTable = this.carRawData;
                this.carsSubject.next(this.carDataTable);
            });

    }


    getUniqueVals(attribute: String): Map<String, number> {
      if (typeof this.carDataTable[0][attribute as keyof Car] === typeof "") {
        var values = this.carDataTable.map(car => car[attribute as keyof Car])
        values = values.sort();
        var uniqueValues = new Set(values);
        var map = new Map();
        var index = 0;
        uniqueValues.forEach((element) => map.set(element, index++));
        return map;
      }
      return new Map();
    }


    getRange(attribute: string) {
      // TODO does this work???
        // https://stackoverflow.com/questions/60330781/how-to-get-lowest-value-from-an-element-in-array-angular
        var minData = this.carDataTable.reduce((prev, current) => (prev[attribute as keyof Car] < current[attribute as keyof Car]) ? prev : current);
        var maxData = this.carDataTable.reduce((prev, current) => (prev[attribute as keyof Car] > current[attribute as keyof Car]) ? prev : current);
        return [minData[attribute as keyof Car], maxData[attribute as keyof Car]];
    }

    selectCar(car: Car) {
      this.selectedCarSubject.next(car);
    }






    // Selections from attribbute explorer
    setAttributeExplorerSelection(cars: Car[]) {
      this.attributeExplorerSelectionSubject.next(cars);
    }

    resetAttributeExplorerSelection() {
      this.attributeExplorerSelectionSubject.next(this.carDataTable);
    }

    // Selections from parallel coordinates
    setParallelCoordinatesSelection(cars: Car[]) {
      this.parallelCoordinatesSelectionSubject.next(cars);
    }

    resetParallelCoordinatesSelection() {
      this.parallelCoordinatesSelectionSubject.next(this.carDataTable);
    }


    // Selections from scatter plot
    setScatterPlotSelection(cars: Car[]) {
      this.scatterPlotSelectionSubject.next(cars);
    }

    resetScatterPlotSelection() {
      this.scatterPlotSelectionSubject.next(this.carDataTable);
    }

    private numberStringToInt(numberString: string) : number {
      switch (numberString) {
        case "one":
          return 1;
        case "two":
          return 2;
        case "three":
          return 3;
        case "four":
          return 4;
        case "five":
          return 5;
        case "six":
          return 6;
        case "seven":
          return 7;
        case "eight":
          return 8;
        case "nine":
          return 9;
        case "ten":
          return 10;
        case "eleven":
          return 11;
        case "twelve":
          return 12;
        default:
          return 0;
      }
    }

    getViewID() {
      this.viewid += 1;
      return this.viewid;
    }





}
