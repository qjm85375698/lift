<template>
<div class="body">
    <div class="liftData">
        <div class='header'>电梯运行状态</div>
        <div class='infoBox'>
            <div class='row1'>
                <div class='currentInfo'>
                    <div class='label'>
                        <div><i class="iconfont icon-371pressure"></i></div>
                        <div><i class="iconfont icon-height"></i></div>
                        <div><i class="iconfont icon-Temperature"></i></div>
                    </div>
                    <div class='value'>
                        <div id="DQYL">{{liftData.DQYL}}</div>
                        <div id="DQGD">{{liftData.DQGD}}</div>
                        <div id="JXJDWD">{{liftData.JXJDWD}}</div>
                    </div>
                </div>
                <div class="line">
                    <div class="lineInner"></div>
                </div>
                <div class="importantInfo">
                    <div class="runInfo">
                        <div class="floor" v-if="liftData.DQFWMS === '1'">{{liftData.DQLC}}</div>
                        <div class="stop" v-if="liftData.DQFWMS === '2'">停用<img src="@/assets/stop.png"> </div>
                        <div class="check" v-if="liftData.DQFWMS === '3'">检修中<img src="@/assets/check.png"> </div>
                        
                    </div>
                </div>
                <div class='line'>
                    <div class="lineInner"></div>
                </div>
                <div class="historyInfo">
                    <div class='label'>
                        <div>电梯运行:</div>
                        <div>电梯开门:</div>
                        <div>运行距离:</div>
                        <div>折弯次数:</div>
                        <!-- <div>累计运行时间:</div> -->
                    </div>
                    <div class="value">
                        <div id="LJYXCS" class="svalue">{{liftData.LJYXCS}}</div>
                        <div id="KMCS" class="svalue">{{liftData.KMCS}}</div>
                        <div id="LJYXJL" class="svalue">{{liftData.LJYXJL}}</div>
                        <div id="GSWZCS" class="svalue">{{liftData.GSWZCS}}</div>
                        <!-- <div id="DTLJYXSJ">{{liftData.DTLJYXSJ}}</div> -->
                    </div>
                </div>
            </div>
            <div class='xLine'>
            </div>
            <div class='row2'>
                <div class="status">
                    <div class="label">
                        <div>运行状态:</div>
                        <div>轿门状态:</div>
                        <div>当前速度:</div>
                    </div>
                    <div class="value">
                        <div>{{liftData.JXYXZT}}</div>
                        <div>{{liftData.JMZT}}</div>
                        <div>{{liftData.DQSD}}</div>
                    </div>
                </div>
                <div class="line">
                    <div class="lineInner"></div>
                </div>
                <div class="direction">
                    <div class="title">
                        电梯健康指数
                    </div>
                    <div class='healthChart' ref="healthChart">

                    </div>
                    <div class="test">
                        <div class="test1">

                        </div>
                        <div class="test2">

                        </div>
                        <div class="test3">

                        </div>
                        <div class="test4">

                        </div>
                        <div class="test5">

                        </div>
                    
                    </div>
                    <div class="healthDescribe">
                        <div class="desc1">
                            很差
                        </div>
                        <div class="desc2">
                            较差
                        </div>
                        <div class="desc3">
                            正常
                        </div>
                        <div class="desc4">
                            良好
                        </div>
                        <div class="desc5">
                            很好
                        </div>
                    </div>
                </div>
                <div class="line">
                    <div class="lineInner"></div>
                </div>
                <div class="angleInfo">
                    <div class="title">
                        电梯姿态
                    </div>
                    <div class="content">
                        <div class="left" :style="{'color': 'red'}">
                            <div id="zfxBox"
                                class="box" 
                                :style="{'transform': 'rotateX('+this.liftData.XJD+'deg) rotateY('+this.liftData.YJD+'deg) rotateZ('+this.liftData.ZJD+'deg)'}"
                            >
                                <div class="surface"></div>
                                <div class="surface"></div>
                                <div class="surface"></div>
                                <div class="surface"></div>
                                <div class="surface"></div>
                                <div class="surface"></div>
                            </div>
                        </div>
                        <div class="right">
                            <div class="directionIcon">
                                <div v-if="true" :class="[true? 'active':'']"> 
                                    <i class="iconfont icon-Up-"></i>
                                </div>
                            </div>
                            <div class="itemGroup">
                                <div class="item">
                                    <div class="label">X:</div>
                                    <div class="value" id="XJD">{{liftData.XJD}}</div>
                                </div>
                                <div class="item">
                                    <div class="label">Y:</div>
                                    <div class="value" id="YJD">{{liftData.YJD}}</div>
                                </div>
                                <div class="item">
                                    <div class="label">Z:</div>
                                    <div class="value" id="ZJD">{{liftData.ZJD}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div v-if="liftData.JXYXFX === '1'" :class="[liftData.JXYXFX === '1'? 'active':'']"> 
                        <i class="iconfont icon-Up-"></i>
                    </div>
                    <div v-if="liftData.JXYXFX === '2'" :class="[liftData.JXYXFX === '2'? 'active':'']">
                        <i class="iconfont icon-Down-"></i>
                    </div> -->


                    
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {jxyxztMap, jmztMap} from '@/utils';
import echarts from 'echarts';
export default {
    name: 'liftData',
    data() {
        return {
            HEALTH_POINT:'',//健康指数,
            liftData: {
                DQFWMS: '1', // 当前服务模式
                JXYXZT: '运行', // 轿厢运行状态
                JXYXFX: '0', // 轿厢运行方向
                DQLC: '7', // 当前楼层
                JMZT: '不完全关闭', // 轿门状态
                LJYXCS: '1945', // 累计运行次数
                KMCS: '1945', // 累计开门次数
                LJYXJL: '1945cm', // 累计运行距离
                GSWZCS: '1945', // 钢丝绳折弯次数
                DQYL: '101.32kpa', // 最大压力
                DQGD: '260cm', // 当前高度
                DQSD: '20m/s', // 当前速度
                XJD: '0°', // X角度
                YJD: '0°', // Y角度
                ZJD: '0°', // Z角度
                DTLJYXSJ: '100s', // 累计运行时间
                JXJDWD: '25℃', // 轿厢温度
                
            },
            socket: null            
        }
    },
    created() {
        this.initSocket();
    },
    mounted() {
        this.initCharts();
    },
    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    },
    //在Chart.vue中加入watch
  watch:{
    //观察option的变化
    HEALTH_POINT(msg){
      this.initCharts();
    }

  },
    methods: {
        initCharts() {
        　　let healthChart = this.$echarts.init(this.$refs.healthChart);
            healthChart.setOption({
                backgroundColor: '#221157',
                // title: [{
                //     show: false,
                //     x: "10%",
                //     y: "13%",
                //     text: '主干道平均车速:36km/h',
                //     textStyle: {
                //         fontWeight: 'normal',
                //         fontSize: 2,
                //         color: "#fff"
                //     },
                // }],
                series: [
                    {
                        name: "",
                        type: 'gauge',
                        min: 0,
                        max: 100,
                        radius: "150%",
                        splitNumber: 1, //刻度数量
                        startAngle: 180,
                        endAngle: 0,
                        center:['50%','90%'],
                        axisLine: { // 坐标轴线
                            lineStyle: { // 属性lineStyle控制线条样式
                                width: 20,
                                color: [
                                    [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                        offset: 0,
                                        color: '#f70700'
                                    }, {
                                        offset: 1,
                                        color: '#3aa600'
                                    }])]
                                ],
                            }
                        },
                        splitLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            color: "#fff",
                            formatter: "{value}",
                            distance: 10,
                            padding: [0, -16, 0, -16],
                            fontSize: 10
                            
                        },

                        axisTick: {
                            show: false
                        },
                        pointer: {
                            show: true,
                            length: '82%',
                            width: 2,
                        },
                        itemStyle: {
                            color: '#0782f9'
                        },
                        title: {
                            show: false,
                        },
                        detail: {
                            show: true,
                            offsetCenter: [0, '-35%'],
                            textStyle: {
                                color: '#8bd100',
                                fontSize: 20,
                                fontWeight: 500
                            }
                        },
                        data: [{
                            show: false,
                            value: this.HEALTH_POINT, //指针数值
                        }]

                    },
                    {
                        name: '拥堵程度',
                        type: 'gauge',
                        min: 0,
                        max: 100,
                        splitNumber: 25,
                        startAngle: 0,
                        endAngle: 180,
                        radius: '180%',
                        center: ['50%', '90%'],
                        axisLine: {
                            show: false,
                            lineStyle: {
                                width: 0
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            color: '#ffffff',
                            fontSize: 8,
                            rotate: '40',
                            formatter: function(e) {
                                switch (e + "") {
                                    case "8":
                                        return "";
                                    case "12":
                                        return "";
                                    case "24":
                                        return "";
                                    case "28":
                                        return "";
                                    case "32":
                                        return "";
                                    case "36":
                                        return "";
                                    case "44":
                                        return "";
                                    case "48":
                                        return "";
                                    case "52":
                                        return "";
                                    case "56":
                                        return "";
                                    case "64":
                                        return "";
                                    case "68":
                                        return "";
                                    case "72":
                                        return "";
                                    case "76":
                                        return "";
                                    case "84":
                                        return "";
                                    case "88":
                                        return "";
                                    case "92":
                                        return "";
                                    case "96":
                                        return "";
                                }
                            },
                        },
                        splitLine: { // 分隔线
                            show: false,
                            length: 19,
                            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'blue',
                                width: 1
                            }

                        },
                        detail: {
                            show: false,
                        },
                        data: [],
                        clockwise: false
                    },
                    {
                        name: '刻度',
                        type: 'gauge',
                        radius: "150%",
                        startAngle: 144,
                        endAngle: 36,
                        center: ['50%', '90%'],
                        min: 20,
                        max: 80,
                        splitNumber: 3,
                        axisLine: { // 坐标轴线
                            lineStyle: { // 属性lineStyle控制线条样式
                                width: 60,
                                color: [
                                    [1, 'rgba(0,0,0,0)']
                                ]
                            }
                        },
                        axisLabel: {
                            show: true,
                            fontSize: 10,
                            color: '#ffffff'
                        },
                        axisTick: {
                            show: false,
                            splitNumber: 10,
                            lineStyle: {
                                color: '#707070', //用颜色渐变函数不起作用
                                width: 1
                            },
                            length: -10
                        },
                        splitLine: {
                            show: true, //改１
                            length: 22,
                            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                                color: '#ffffff',
                                width: 1
                            }
                        },
                        pointer: {
                            show: false
                        }
                    },
                    {
                        "name": '指针小圆形', //装饰作用
                        "type": 'pie',
                        "hoverAnimation": false,
                        "legendHoverLink": false,
                        "radius": ['0%', '1%'],
                        "center": ['50%', '50%'],
                        "z": 10,
                        "label": {
                            "normal": {
                                "show": false,
                                "position": 'center'
                            },
                            "emphasis": {
                                "show": false
                            }
                        },
                        "labelLine": {
                            "normal": {
                                "show": false
                            }
                        },
                        "data": [{
                            "value": 0,
                            "name": '1',
                            itemStyle: {
                                normal: {
                                    color: "red"
                                }
                            }
                        }, {
                            "value": 100,
                            "name": '2',
                            itemStyle: {
                                normal: {
                                    color: "#0782f9"
                                },
                                emphasis: {
                                    color: "#0782f9"
                                }
                            }
                        }]
                    },
                    {
                        name: '',
                        type: 'gauge',
                        z: 100,
                        min: 0,
                        max: 100,
                        splitNumber: 5,
                        startAngle: 0,
                        endAngle: 180,
                        center:['50%','90%'],
                        radius: '170%',
                        axisLine: { // 坐标轴线
                            lineStyle: { // 属性lineStyle控制线条样式
                                width: 4,
                                color: [
                                    [1, '#0666c9']
                                ],
                                opacity: 1
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                        },
                        splitLine: { // 分隔线
                            show: false,
                            length: 15,
                        },
                        detail: {
                            show: false,
                        },
                        data: [],
                        clockwise: false
                    }
                ]
            });
        },
        initSocket() {
            if(typeof(WebSocket) === "undefined"){
                  alert("您的浏览器不支持socket")
            }else{
                //console.log("device_id:"+device_id);
                
                // 实例化socket
                //this.socket = new WebSocket("ws://134.175.201.123:8879/message");
                // this.socket = new WebSocket("ws://134.175.201.123:8879/message");
                this.socket = new WebSocket("ws://localhost:8080/message");
                //this.socket = new WebSocket("ws://10.100.30.130:8080/message");
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
                this.socket.onclose=this.close;
            }
        },
        open() {
            const {query} = this.$route;
            const {device_key} = query || {};
            const {accessToken} = query || {};
            console.log('access_token:'+accessToken);
            if (!device_key){
                alert("请传电梯id")
                return;
            }
            console.log("socket连接成功");
           var json_obj={
                accessToken:"abcd",
                device_key:device_key
            };
            console.log(JSON.stringify(json_obj));
            var jsonStr = JSON.stringify(json_obj);
            this.send(jsonStr);
        },
        error() {
            console.log("连接错误");
            this.socket.close;
        },
        getMessage(msg) {
            console.log(msg.data);
            let msgData = JSON.parse(msg.data);
            for (var x = 0; x < msgData.length; x++) {
                Object.keys(this.liftData).forEach(key => {
                    if(msgData[x].code === key){

                        if(msgData[x].code==='XJD'|| msgData[x].code==='YJD'|| msgData[x].code==='ZJD'){
                            this.liftData[key] = (msgData[x].value).toFixed(2);

                        }
                        if( msgData[x].code==='DQYL'|| msgData[x].code==='DQGD'|| msgData[x].code==='JXJDWD'){
                            this.liftData[key] = (msgData[x].value).toFixed(2) +msgData[x].unit;
                        
                        }else{
                            // 这个会将所有的非字符变成字符
                            this.liftData[key] = msgData[x].value + (msgData[x].unit? msgData[x].unit: '');
                        }
                    }
                })
                //JXYXZT 轿厢运行状态
                if (msgData[x].code==='JXYXZT') {
                    let match = false;
                    jxyxztMap.forEach(map => {
                        if (map.key === this.liftData.JXYXZT) {
                            this.liftData.JXYXZT = map.value;
                            match = true;
                        }
                    })
                    if (!match) {
                        this.liftData.JXYXZT = '未知';
                    }
                }
                //JMZT 轿门状态
                if (msgData[x].code==='JMZT') {
                    let match = false;
                    jmztMap.forEach(map => {
                        if (map.key === this.liftData.JMZT) {
                            this.liftData.JMZT = map.value;
                            match = true;
                        }
                    })
                    if (!match) {
                        this.liftData.JMZT = '未知';
                    }
                    
                }
                //HEALTH_POINT
                if (msgData[x].code==='HEALTH_POINT') {
                    this.HEALTH_POINT = msgData[x].value;
                }

            }
        },    
        send(msg) {

            this.socket.send(msg)
        },
        close () {
            console.log("socket已经关闭");
            //释放资源

            setTimeout(() =>{
                console.log('正在尝试重连。。。');
                this.initSocket();
            },5000);

        }
    }
}
</script>
<style lang="less">
// div {font-family: Arial, sans-serif;}
// .div{ font-family:'Microsoft YaHei' !important;}
.body{
    // font-family:"\5FAE\8F6F\96C5\9ED1 !important";
    font-family: '微软雅黑' ! important;
}
.liftData{
    width: 768px;
    height: 436px;
    padding-bottom: 20px;
    background-color:#221157;
    position: relative;
    overflow: hidden;
    .header {
        height: 50px;
        width: 100%;
        text-align: center;
        line-height: 50px;
        color: white;
        font-size: 20px;
        font-family: '微软雅黑' ! important;
    }
    .infoBox{
        height: 376px;
        width: 700px;
        border: 5px solid white;
        position: relative;
        margin: 0 auto;
        padding: 0 10px;
        color: white;
        .row1,.row2{
            height: 50%;
            width: 100%;
            position: relative;
            .line{
                height: 106px;
            }
        }
        .currentInfo {
            float: left;
            height: 146px;
            width: 30%;
            padding: 20px 0;
            .label{
                font-family: '微软雅黑  !important';
                width: 20%;
                float: left;
                i{
                    font-size: 28px;
                }
                &>div{
                    height: 49px;
                    line-height: 49px;
                }
            }
            .value {
                width: 80%;
                float: left;
                font-size: 28px;
                // font-family:'Microsoft YaHei' !important;
                &>div{
                    height: 49px;
                    line-height: 49px;
                    text-align: left;
                }
            }
        }
        .importantInfo{
            float: left;
            height: 146px;
            width: 30%;
            padding: 20px 0;
            .runInfo{
                height: 100%;
                .floor{
                    line-height: 146px;
                    font-family: 'led regular';
                    font-size: 90px;
                    height: 100%;
                    text-align: center;
                }
                .check,.stop{
                    width: 72%;
                    height: 100%;
                    margin: 0 auto;
                    animation: flash 1s infinite linear;
                    img{
                        width: 80%;
                        height: 80%;
                    }
                }
            }
        }
        .historyInfo{
            float: left;
            padding: 20px 0;
            height: 146px;
            width: 30%;
            .label{
                width: 50%;
                float: left;
                &>div{
                    font-size: 20px;
                    text-align: left;
                    height: 36px;
                    line-height: 36px;
                };
                .slabel{
                    font-size: 14px;
                    text-align: left;
                    height: 36px;
                    line-height: 36px;
                }
            }
            .value{
                width: 50%;
                float: left;
                &>div{
                    font-size: 20px;
                    text-align: left;
                    height: 36px;
                    line-height: 36px;
                }
            }
        }
        .line{
            margin: 40px 0; 
            float: left;
            width: 5%;
            height: 124px;
            text-align: center;
            .lineInner{
                height: 100%;
                width: 4px;
                background-color: white;
                display: inline-block;
                border-radius: 4px;
            }
        }
        .xLine{
            height: 4px;
            position: absolute;
            width: 700px;
            background: white;
            top: 186px;
            border-radius: 4px;
        }
    }
    .status{
        float: left;
        height: 146px;
        padding: 20px 0;
        width: 30%;
        .label{
            width: 50%;
            float: left;
            font-size: 20px;
            &>div{
                height: 49px;
                line-height: 49px;
            }
        }
        .value {
            width: 50%;
            float: left;
            font-size: 20px;
            &>div{
                text-align: left;
                height: 49px;
                line-height: 49px;
            }
        }
    }
    .direction{
        float: left;
        height: 146px;
        width: 30%;
        padding: 20px 0;
        position: relative;
        .title{
            height: 26px;
            line-height: 26px;
        }
        .healthChart{
            height: 120px;
        }
        .test{
            width: 188px;
            height: 16px;
            margin: -10px 0px 5px 10px;
            border:1px solid white;


            .test1{
                width: 35px;
                height: 13px;
                margin: 0px 0px 0px -1px;
                border:2px solid red;
                background-color: red;
            };
            .test2{
                width: 35px;
                height: 13px;
                margin: -17px 0px 0px 38px;
                border:2px solid #FF8000;
                background-color:  #FF8000;
                
            };
            .test3{
                width: 38px;
                height: 13px;
                margin: -17px 0px 0px 76px;
                border:2px solid yellow;
                background-color: yellow;
            };
            .test4{
                width: 35px;
                height: 13px;
                margin: -17px 0px 0px 116px;
                border:2px solid #629700;
                background-color: #629700;
            };
            .test5{
                width: 33px;
                height: 13px;
                margin: -17px 0px 0px 153px;
                border:2px solid rgb(12, 240, 50);
                background-color: rgb(12, 240, 50);
            };
        }
        .healthDescribe{
            width: 189px;
            height: 12px;
            margin: -5px 0px 5px 10px;
            // border:1px solid white;
            .desc1{
                font-size: 5px;
                width: 35px;
                height: 13px;
                margin: -7px 0px 0px -1px;
                // border:2px solid red;
                // background-color: red;
            };
            .desc2{
                font-size: 5px;
                width: 35px;
                height: 13px;
                margin: -12px 0px 0px 38px;
                // border:2px solid #FF8000;
                // background-color:  #FF8000;
                
            };
            .desc3{
                font-size: 5px;
                width: 38px;
                height: 13px;
                margin: -13px 0px 0px 76px;
                // border:2px solid yellow;
                // background-color: yellow;
            };
            .desc4{
                font-size: 5px;
                width: 35px;
                height: 13px;
                margin: -13px 0px 0px 116px;
                // border:2px solid #629700;
                // background-color: #629700;
            };
            .desc5{
                font-size: 5px;
                width: 33px;
                height: 13px;
                margin: -13px 0px 0px 153px;
                // border:2px solid rgb(12, 240, 50);
                // background-color: rgb(12, 240, 50);
            };
        }
    }
    .angleInfo{
        float: left;
        padding: 20px 0;
        width: 30%;
        height: 146px;
        color: white;
        .title{
            text-align: left;
            height: 26px;
            line-height: 26px;
        }
        .content{
            height: 120px;
            .left,.right{
                height: 100%;
                width: 50%;
                float:left;
            }
            .left{
                padding-top: 30px;
                .box{
                    margin: 0 auto;
                    width: 62px;
                    height: 62px;
                    position: relative;
                    transform-style: preserve-3d;
                    .surface{
                        width: 60px;
                        height: 60px;
                        border: 1px solid white;
                        position: absolute;
                        text-align: center;
                        line-height: 60px;
                        &:nth-child(1){
                            transform:rotateX(90deg)  translateZ(30px);
                        }
                        &:nth-child(2){
                            transform:rotateX(270deg) translateZ(30px);
                        }
                        &:nth-child(3){
                            transform:rotateY(90deg) translateZ(30px);
                        }
                        &:nth-child(4){
                            transform:rotateY(270deg) translateZ(30px);
                        }
                        &:nth-child(5){
                            transform:translateZ(-30px);
                        }
                        &:nth-child(6){
                            transform: translateZ(30px) ;
                        }
                    }
                }
            }
            .right{
                .directionIcon{
                    height: 30px;
                    line-height: 30px;
                    i{
                        font-size: 24px;
                    }
                }
                .item{
                    height: 30px;
                    line-height: 30px;
                    font-size: 20px;
                }
            }
        }
        .label{
            margin: 0 3px;
            float: left;
        }
        .value{
            float: left;
        }
        .active{
            i{

                color: red;
                animation:flash 1s infinite linear;
            }
        }
    }
}
</style>
