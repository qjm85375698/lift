<template>
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
                        <div>累计运行次数:</div>
                        <div>累计开门次数:</div>
                        <div>累计运行距离:</div>
                        <div>钢绳折弯次数:</div>
                        <!-- <div>累计运行时间:</div> -->
                    </div>
                    <div class="value">
                        <div id="LJYXCS">{{liftData.LJYXCS}}</div>
                        <div id="KMCS">{{liftData.KMCS}}</div>
                        <div id="LJYXJL">{{liftData.LJYXJL}}</div>
                        <div id="GSWZCS">{{liftData.GSWZCS}}</div>
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
                    <div v-if="liftData.JXYXFX === '0'" class="twoLine">
                        <!-- <i class="iconfont icon-two-line"></i>        -->
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

                </div>
                <div class="line">
                    <div class="lineInner"></div>
                </div>
                <div class="angleInfo">
                    <div class="title">
                        电梯姿态
                    </div>
                    <div v-if="true" :class="[true? 'active':'']"> 
                        <i class="iconfont icon-Up-"></i>
                    </div>
                    <!-- <div v-if="liftData.JXYXFX === '1'" :class="[liftData.JXYXFX === '1'? 'active':'']"> 
                        <i class="iconfont icon-Up-"></i>
                    </div>
                    <div v-if="liftData.JXYXFX === '2'" :class="[liftData.JXYXFX === '2'? 'active':'']">
                        <i class="iconfont icon-Down-"></i>
                    </div> -->


                    
                    <div class="item">
                        <div class="label">x:</div>
                        <div class="value" id="XJD">{{liftData.XJD}}</div>
                    </div>
                    <div class="item">
                        <div class="label">y:</div>
                        <div class="value" id="YJD">{{liftData.YJD}}</div>
                    </div>
                    <div class="item">
                        <div class="label">z:</div>
                        <div class="value" id="ZJD">{{liftData.ZJD}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {jxyxztMap, jmztMap} from '@/utils';
export default {
    name: 'liftData',
    data() {
        return {
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
                JXJDWD: '25℃' // 轿厢温度
            },
            socket: null            
        }
    },
    created() {
        this.initSocket();
    },
    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    },
    methods: {
        initSocket() {
            if(typeof(WebSocket) === "undefined"){
                  alert("您的浏览器不支持socket")
            }else{
                //console.log("device_id:"+device_id);
                
                // 实例化socket
                //this.socket = new WebSocket("ws://134.175.201.123:8879/message");
                this.socket = new WebSocket("ws://134.175.201.123:8879/message");
                //this.socket = new WebSocket("ws://localhost:8080/message");
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
                        if(msgData[x].code==='XJD'|| msgData[x].code==='YJD'|| msgData[x].code==='ZJD'
                        || msgData[x].code==='DQYL'|| msgData[x].code==='DQGD'|| msgData[x].code==='JXJDWD'){
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
                        width: 100%;
                        height: 100%;
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
                width: 70%;
                float: left;
                &>div{
                    font-size: 20px;
                    text-align: left;
                    height: 36px;
                    line-height: 36px;
                }
            }
            .value{
                width: 30%;
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
        >div{
            width: 100%;
            float: left;
            height: 146px;
            line-height: 146px;
            i{
                font-size: 100px;
            }
        }
        .test{
            width: 188px;
            height: 16px;
            margin: -60px 0px 5px 10px;
            border:3px solid white;


            .test1{
                width: 35px;
                height: 13px;
                margin: 0px 0spx 0px 0px;
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

        .title{
            text-align: center;
            height: 20px;
            line-height: 20px;
            margin: 6px;
        }
        .active{
            i{
                color: red;
                animation:flash 1s infinite linear;
            }
        }
    }
    .angleInfo{
        float: left;
        padding: 20px 0;
        width: 30%;
        height: 146px;
        color: white;
        >div{
            width: 100%;
            float: left;
            height: 6px;
            line-height: 16px;
            i{
                font-size: 50px;
            }
        }
        .title{
            text-align: center;
            height: 20px;
            line-height: 20px;
            margin: 6px;
        }
        .item{
            margin-left:100px;
            height: 30px;
            line-height: 30px;
            font-size: 20px;
        }
        .label{
            margin: 0 20px;
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
