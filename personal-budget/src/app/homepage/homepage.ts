import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import * as d3 from 'd3';
import { isPlatformBrowser } from '@angular/common';
import { Article } from '../article/article';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs';
import { DataService } from '../data';

Chart.register(...registerables);

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Article, BreadcrumbsComponent],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})
export class Homepage implements AfterViewInit {
  @ViewChild('myChart', { static: true }) myChartRef!: ElementRef;
  @ViewChild('d3Chart', { static: true }) d3ChartRef!: ElementRef;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBudgetDataAndCreateCharts();
    }
  }

  loadBudgetDataAndCreateCharts() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.dataService.getBudget().subscribe({
      next: res => {
        if (res?.myBudget) {
          const labels = res.myBudget.map((b: any) => b.title);
          const data = res.myBudget.map((b: any) => b.budget);
          this.createChartJs(labels, data);
          this.createD3Chart(labels, data);
        } else {
          console.error("Budget data missing 'myBudget'");
        }
      },
      error: err => console.error(err)
    });
  }


  createChartJs(labels: string[], data: number[]) {
    const canvas = this.myChartRef.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return console.error("Canvas context not found!");

    console.log("Creating Chart.js chart...");
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#8BC34A'
          ]
        }]
      }
    });
  }

  createD3Chart(labels: string[], data: number[]) {
    const svgEl = this.d3ChartRef.nativeElement as HTMLElement;
    d3.select(svgEl).selectAll('*').remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgEl)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(labels)
      .range(d3.schemeCategory10);

    const pie = d3.pie<number>().value(d => d)(data);

    const arc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(0)
      .outerRadius(radius);

    svg.selectAll('path')
      .data(pie)
      .join('path')
      .attr('d', arc as any)
      .attr('fill', (d, i) => color(labels[i]) as string);
  }
}
