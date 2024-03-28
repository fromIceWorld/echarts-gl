import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-gl';
import { transformValue } from '../common/index';
import { config } from '../decorators/index';
import { GL_CONFIG } from './echarts-gl';
//@ts-ignore
import { Subject, debounceTime } from 'rxjs';
import xiongan from './map/xiongan.json';

@config(GL_CONFIG)
@Component({
  selector: 'my-echarts-gl-map',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  static tagNamePrefix: string = 'my-echarts-gl-map';
  @ViewChild('map', { static: true }) map: any;
  @ViewChild('kFps', { static: true }) kFps: any;
  fps = 60;
  title = 'my-echarts-gl';
  chart: any;
  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit() {
    this.initMap();
    // this.getFPS();
  }
  resizeObserver() {
    const resizeCenter = new Subject();
    const chartObserver = new ResizeObserver(() => {
      //TODO: resize时会将纹理贴图丢失; resize后再重置纹理贴图会闪烁
      // let option = this.chart.getOption();
      // const pattern = new Image();
      // pattern.src = '/assets/b.jpg';
      // option.geo3D[0].realisticMaterial.detailTexture = pattern;
      resizeCenter.next(null);
      // this.chart.setOption(option);
    });
    chartObserver.observe(this.map.nativeElement);
    resizeCenter.pipe(debounceTime(500)).subscribe((res) => {
      this.chart.resize();
    });
  }
  // bg: any;
  // chartOption = {
  //   geo: {
  //     zlevel: -100,
  //     show: true,
  //     map: 'xiongan', // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同

  //     itemStyle: {
  //       borderWidth: 1,
  //       borderColor: '#2ea2cf',
  //       color: 'white',
  //       opacity: 1,
  //     },
  //     emphasis: {
  //       itemStyle: {
  //         show: false,
  //         color: 'yellow',
  //         borderColor: 'white',
  //         borderWidth: 2,
  //         opacity: 1,
  //       },
  //     },
  //     label: {
  //       show: true, // 是否显示标签。
  //       textStyle: {
  //         color: 'white', // 地图初始化区域字体颜色
  //         fontSize: 40,
  //       },
  //       color: 'white',
  //       formatter: (e: any) => {
  //         return e.name;
  //       },
  //     },
  //   },
  //   series: [],
  // };
  initMap() {
    // echarts.registerMap(`xiongan`, xiongan as any);
    // const canvas = document.createElement(`canvas`);
    // this.bg = echarts.init(canvas, null, {
    //   width: 1024,
    //   height: 1024,
    // });
    // this.bg.setOption(this.chartOption);
    const pattern = new Image();
    pattern.src = '/assets/b.jpg';
    var chart = (this.chart = echarts.init(this.map.nativeElement));
    echarts.registerMap('xiongan', xiongan as any);
    this.resizeObserver();
    chart.setOption(
      {
        geo3D: {
          zlevel: -100,
          show: true,
          map: 'xiongan', // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
          regionHeight: 2,
          shading: 'realistic',
          realisticMaterial: {
            detailTexture: '/assets/b.jpg',
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#2ea2cf',
            color: 'white',
            opacity: 1,
          },
          emphasis: {
            itemStyle: {
              show: true,
              color: 'green',
              borderColor: 'white',
              borderWidth: 2,
              opacity: 0.5,
            },
          },
          label: {
            show: true, // 是否显示标签。
            textStyle: {
              color: 'white', // 地图初始化区域字体颜色
              fontSize: 40,
            },
            color: 'white',
            formatter: (e: any) => {
              return e.name;
            },
          },
        },
        // colorMaterial: {
        //   detailTexture: this.bg,
        //   textureTiling: 1,
        // },
        series: [
          // {
          //   type: 'scatter3D',
          //   coordinateSystem: 'geo3D',
          //   data: [
          //     {
          //       name: '北京',
          //       value: [116.405285, 39.904989, 5],
          //     },
          //     {
          //       name: '花都',
          //       value: [113.211184, 23.39205, 5],
          //     },
          //     {
          //       name: '天河',
          //       value: [113.335367, 23.13559, 5],
          //     },
          //     {
          //       name: '黄埔',
          //       value: [113.450761, 23.103239, 5],
          //     },
          //     {
          //       name: '南沙',
          //       value: [113.53738, 22.794531, 5],
          //     },
          //     {
          //       name: '新疆',
          //       value: [87.617733, 43.792818, 2],
          //     },
          //   ],
          //   symbol: 'circle',
          //   symbolSize: 10,
          //   itemStyle: {
          //     normal: {
          //       color: 'red',
          //       shadowBlur: 10,
          //       shadowColor: '#0a99ff',
          //       shadowOffsetY: 0,
          //     },
          //   },
          //   emphasis: {
          //     label: {
          //       show: true,
          //       textStyle: {
          //         backgroundColor: {
          //           // image: '',
          //           image: '/assets/b.jpg',
          //         },
          //       },
          //     },
          //   },
          // },
          // {
          //   type: 'lines3D',
          //   coordinateSystem: 'geo3D',
          //   effect: {
          //     show: true,
          //     period: 8,
          //     trailLength: 0.5,
          //     symbol: 'arrow',
          //     symbolSize: 8,
          //   },
          //   lineStyle: {
          //     normal: {
          //       color: '#43D0FF',
          //       curveness: 0.5,
          //       width: 1,
          //       opacity: 1,
          //     },
          //   },
          //   data: [
          //     [
          //       [116.405285, 39.904989, 5], // 起点的经纬度和海拔坐标
          //       [113.211184, 23.39205, 5], // 终点的经纬度和海拔坐标
          //     ],
          //     [
          //       [116.405285, 39.904989, 5], // 起点的经纬度和海拔坐标
          //       [87.617733, 43.792818, 2], // 终点的经纬度和海拔坐标
          //     ],
          //   ],
          // },
        ],
      }
      // {
      //   geo3D: {
      //     map: 'xiongan',
      //     roam: true,
      //     tooltip: {
      //       show: true,
      //       trigger: 'axis',
      //     },
      //     itemStyle: {
      //       color: '#efcbcb',
      //       borderWidth: 1.5,
      //       borderColor: '#459bca',
      //       shadowOffsetX: 1000,
      //       shadowOffsetY: 100,
      //       opacity: 0.8, //透明度
      //       shadowBlur: 8, //阴影大小
      //       type: 'dotted', //实线
      //     },
      //     label: {
      //       show: true,
      //       textStyle: {
      //         color: '#00ff7f',
      //         fontSize: 8,
      //         opacity: 1,
      //       },
      //     },
      //     light: {
      //       main: {
      //         color: '#fff',
      //         intensity: 1,
      //         shadow: true,
      //         alpha: 40,
      //         beta: 30,
      //       },
      //       ambient: {
      //         intensity: 0,
      //       },
      //       ambientCubemap: {
      //         cubemap: {},
      //         diffuseIntensity: 1,
      //         texture: '',
      //       },
      //     },
      //     groundPlane: {
      //       show: false,
      //     },
      //   },
      //   colorMaterial: {
      //     detailTexture: pattern,
      //   },
      //   series: [
      //     {
      //       type: 'scatter3D',
      //       coordinateSystem: 'geo3D',
      //       data: [
      //         {
      //           name: '北京',
      //           value: [116.405285, 39.904989, 5],
      //         },
      //         {
      //           name: '花都',
      //           value: [113.211184, 23.39205, 5],
      //         },

      //         {
      //           name: '天河',
      //           value: [113.335367, 23.13559, 5],
      //         },
      //         {
      //           name: '黄埔',
      //           value: [113.450761, 23.103239, 5],
      //         },
      //         {
      //           name: '南沙',
      //           value: [113.53738, 22.794531, 5],
      //         },
      //         {
      //           name: '新疆',
      //           value: [87.617733, 43.792818, 2],
      //         },
      //       ],
      //       symbol: 'circle',
      //       symbolSize: 10,
      //       itemStyle: {
      //         color: 'green',
      //         opacity: 0.8,
      //       },
      //       emphasis: {
      //         label: {
      //           show: true,
      //           textStyle: {
      //             backgroundColor: {
      //               // image: '',
      //               image: '/assets/b.jpg',
      //             },
      //           },
      //         },
      //       },
      //     },
      //     {
      //       type: 'lines3D',
      //       coordinateSystem: 'geo3D',
      //       effect: {
      //         show: true,
      //         period: 4,
      //       },
      //       lineStyle: {
      //         color: 'red',
      //         width: 2,
      //       },
      //       data: [
      //         [
      //           [116.405285, 39.904989, 5], // 起点的经纬度和海拔坐标
      //           [113.211184, 23.39205, 5], // 终点的经纬度和海拔坐标
      //         ],
      //         [
      //           [116.405285, 39.904989, 5], // 起点的经纬度和海拔坐标
      //           [87.617733, 43.792818, 2], // 终点的经纬度和海拔坐标
      //         ],
      //       ],
      //     },
      //   ],
      // }
    );
  }
  static extends(option: any): { tagName: string; html: string; js: string } {
    // web component 的索引不能递增，因为索引重置后会重复，而且cache后apply会有冲突。
    const index = String(Math.random()).substring(2),
      tagName = `${AppComponent.tagNamePrefix}-${index}`;
    const { html, className } = option;

    let config: any = {};
    Object.keys({}).map((key) => {
      config[key] = transformValue(html[key]);
    });
    return {
      tagName: `${tagName}`,
      html: `<${tagName}></${tagName}>`,
      js: `class MyEchartsGLMap${index} extends ${className}{
             constructor(){
                 super();
             }
         }
         MyEchartsGLMap${index}.ɵcmp.factory = () => { return new MyEchartsGLMap${index}()};
         (()=>{
          let customEl = createCustomElement3(MyEchartsGLMap${index}, {  injector: injector3,});
          // 添加用户自定义数据
          Object.defineProperty(customEl.prototype,'option',{
            get(){
              return ${JSON.stringify(config)}
            },
            configurable: false,
            enumerable: false
          })
          // 获取class instance
          Object.defineProperty(customEl.prototype,'instance',{
            get(){
              return this._ngElementStrategy.componentRef.instance
            },
            configurable: false,
            enumerable: false
          })
          customElements.define('${tagName}',customEl);
       })();
         `,
    };
  }
  getFPS() {
    let be = Date.now(),
      that = this;
    requestAnimationFrame(function loop() {
      let now = Date.now();
      that.fps = Math.round(1000 / (now - be));
      that.cd.detectChanges();
      be = now;
      requestAnimationFrame(loop);
    });
  }
}
