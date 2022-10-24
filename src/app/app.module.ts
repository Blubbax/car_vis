import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistogramComponent } from './vis/histogram/histogram.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TableComponent } from './vis/table/table.component';
import { ScatterPlotComponent } from './vis/scatter-plot/scatter-plot.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { ParallelCoordinatesComponent } from './vis/parallel-coordinates/parallel-coordinates.component';
import { CarComponent } from './components/car/car.component';
import { RadarChartComponent } from './vis/radar-chart/radar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HistogramComponent,
    HeaderComponent,
    FooterComponent,
    TableComponent,
    ScatterPlotComponent,
    VisualizationComponent,
    ParallelCoordinatesComponent,
    CarComponent,
    RadarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
