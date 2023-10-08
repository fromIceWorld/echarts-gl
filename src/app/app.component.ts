import { Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-gl';
import { transformValue } from '../common/index';
import { config } from '../decorators/index';
import { GL_CONFIG } from './echarts-gl';
//@ts-ignore
import china from './map/china.json';

@config(GL_CONFIG)
@Component({
  selector: 'my-echarts-gl-map',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  static tagNamePrefix: string = 'my-echarts-gl-map';
  @ViewChild('map', { static: true }) map: any;
  title = 'my-echarts-gl';
  chart: any;
  ngOnInit() {
    this.initMap();
  }
  resizeObserver() {
    const chartObserver = new ResizeObserver(() => {
      //TODO: resize时会将纹理贴图丢失; resize后再重置纹理贴图会闪烁
      // let option = this.chart.getOption();
      // const pattern = new Image();
      // pattern.src = '/assets/b.jpg';
      // option.geo3D[0].realisticMaterial.detailTexture = pattern;
      this.chart.resize();
      // this.chart.setOption(option);
    });
    chartObserver.observe(this.map.nativeElement);
  }
  initMap() {
    const pattern = new Image();
    pattern.src = '/assets/b.jpg';
    var chart = (this.chart = echarts.init(this.map.nativeElement));
    echarts.registerMap('china', china);
    this.resizeObserver();
    chart.setOption({
      geo3D: {
        map: 'china',
        roam: true,
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        itemStyle: {
          color: '#efcbcb',
          borderWidth: 1.5,
          borderColor: '#459bca',
          shadowOffsetX: 1000,
          shadowOffsetY: 100,
          opacity: 0.8, //透明度
          shadowBlur: 8, //阴影大小
          type: 'dotted', //实线
        },
        shading: 'realistic',
        label: {
          show: true,
          textStyle: {
            color: '#00ff7f',
            fontSize: 8,
            opacity: 1,
          },
          formatter: (params: any) => `${params.name}`,
        },
        light: {
          main: {
            color: '#fff',
            intensity: 1,
            shadow: true,
            alpha: 40,
            beta: 30,
          },
          ambient: {
            intensity: 0,
          },
          ambientCubemap: {
            cubemap: {},
            diffuseIntensity: 1,
            texture: '',
          },
        },

        groundPlane: {
          show: false,
        },
        visualMap: {
          //视角控制
          show: true,
          min: 0,
          max: 100,
          calculable: true,
        },
        globe: {
          // 光照效果
          baseColor: '#fff0.5',
          shading: 'color',
        },
        regions: [
          // {
          //   name: '北京市',
          //   itemStyle: {
          //     color: 'red',
          //   },
          // },
          {
            name: '河北省',
            itemStyle: {
              color: 'red',
            },
          },

          {
            name: '河南省',
            itemStyle: {
              color: 'yellow',
            },
          },
        ],
        realisticMaterial: {
          detailTexture: pattern, // 纹理贴图
          textureTiling: 1, // 纹理平铺，1是拉伸，数字表示纹理平铺次数
          roughness: 1, // 材质粗糙度，0完全光滑，1完全粗糙
          metalness: 0, // 0材质是非金属 ，1金属
          roughnessAdjust: 0,
        },
      },
      // colorMaterial: {
      //   detailTexture: pattern,
      // },
      series: [
        {
          type: 'scatter3D',
          coordinateSystem: 'geo3D',
          data: [
            {
              name: '北京',
              value: [116.405285, 39.904989, 5],
            },
            {
              name: '花都',
              value: [113.211184, 23.39205, 5],
            },

            {
              name: '天河',
              value: [113.335367, 23.13559, 5],
            },
            {
              name: '黄埔',
              value: [113.450761, 23.103239, 5],
            },
            {
              name: '南沙',
              value: [113.53738, 22.794531, 5],
            },
            {
              name: '新疆',
              value: [87.617733, 43.792818, 2],
            },
          ],
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: 'green',
            opacity: 0.8,
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                backgroundColor: {
                  // image: '',
                  image: '/assets/b.jpg',
                },
              },
            },
          },
        },
        {
          type: 'lines3D',
          coordinateSystem: 'geo3D',
          effect: {
            show: true,
            period: 4,
          },
          lineStyle: {
            color: 'red',
            width: 2,
          },
          data: [
            [
              [116.405285, 39.904989, 5], // 起点的经纬度和海拔坐标
              [113.211184, 23.39205, 5], // 终点的经纬度和海拔坐标
            ],
            [
              [116.405285, 39.904989, 5], // 起点的经纬度和海拔坐标
              [87.617733, 43.792818, 2], // 终点的经纬度和海拔坐标
            ],
          ],
        },
      ],
    });
  }
  static extends(option: any): { tagName: string; html: string; js: string } {
    // web component 的索引不能递增，因为索引重置后会重复，而且cache后apply会有冲突。
    const index = String(Math.random()).substring(2),
      tagName = `${AppComponent.tagNamePrefix}-${index}`;
    const { html, css, className } = option;
    let styleStr = '';
    for (let [key, value] of Object.entries(css)) {
      // @ts-ignore
      styleStr += `${key}:${value.value}${value.postfix || ''};`;
    }
    let config: any = {};
    Object.keys(html).map((key) => {
      config[key] = transformValue(html[key]);
    });
    return {
      tagName: `${tagName}`,
      html: `<${tagName} _data="_ngElementStrategy.componentRef.instance"
                        _methods="_ngElementStrategy.componentRef.instance" 
                       style="${styleStr}"></${tagName}>`,
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
}
