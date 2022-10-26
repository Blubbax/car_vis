import { Car } from './../model/car';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

    public cars: Observable<Car[]>;
    private carsSubject: BehaviorSubject<any>;
    private carRawData: Car[] = [];
    private carDataTable: Car[] = [];

    public brushingSelection: Observable<Car[]>;
    private brushingSelectionSubject: BehaviorSubject<any>;

    public mainBrushingSelection: Observable<Car[]>;
    private mainBrushingSelectionSubject: BehaviorSubject<any>;

    public selectedCar: Observable<Car>;
    private selectedCarSubject: BehaviorSubject<any>;

    constructor(private httpClient: HttpClient) {

        this.carsSubject = new BehaviorSubject<Car[]>(this.carRawData);
        this.cars = this.carsSubject.asObservable();

        this.selectedCarSubject = new BehaviorSubject<Car | undefined>(undefined);
        this.selectedCar = this.selectedCarSubject.asObservable();

        this.brushingSelectionSubject = new BehaviorSubject<Car[]>([]);
        this.brushingSelection = this.brushingSelectionSubject.asObservable();

        this.mainBrushingSelectionSubject = new BehaviorSubject<Car[]>([]);
        this.mainBrushingSelection = this.mainBrushingSelectionSubject.asObservable();

        const headers = new HttpHeaders({
            Accept: 'text/csv',
        });

        this.httpClient.get<any>('assets/cars.csv', { headers, responseType: 'text' as any })
            .subscribe(result => {
                var dataObjects = result.split('\n');
                dataObjects.splice(0, 1);
                dataObjects.forEach((carString: string) => {
                    const carData = carString.split(',');
                    const car: Car = {
                        riskFactor: parseInt(carData[0]),
                        normalizedLosses: parseInt(carData[1]),
                        make: carData[2],
                        fuelType: carData[3],
                        aspiration: carData[4],
                        numOfDoors: parseInt(carData[5]),
                        bodyStyle: carData[6],
                        driveWheels: carData[7],
                        engineLocation: carData[8],
                        wheelBase: parseInt(carData[9]),
                        length: parseInt(carData[10]),
                        width: parseInt(carData[11]),
                        height: parseInt(carData[12]),
                        curbWeight: parseInt(carData[13]),
                        engineType: carData[14],
                        numOfCylinders: parseInt(carData[15]),
                        engineSize: parseInt(carData[16]),
                        fuelSystem: carData[17],
                        bore: parseInt(carData[18]),
                        stroke: parseInt(carData[19]),
                        compressionRatio: parseInt(carData[20]),
                        horsepower: parseInt(carData[21]),
                        peakRpm: parseInt(carData[22]),
                        cityMpg: parseInt(carData[23]),
                        highwayMpg: parseInt(carData[24]),
                        price: parseInt(carData[25])
                    };

                    this.carRawData.push(car);
                });

                this.carRawData.pop(); // Last element not a real car
                this.carDataTable = this.carRawData;
                this.carsSubject.next(this.carDataTable);
            });

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

    setBrushingSelection(cars: Car[]) {
      this.brushingSelectionSubject.next(cars);
    }

    setMainBrushingSelection(cars: Car[]) {
      this.mainBrushingSelectionSubject.next(cars);
    }

    resetBrushingSelection() {
      this.brushingSelectionSubject.next(this.carDataTable);
    }

}
