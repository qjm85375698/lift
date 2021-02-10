<template>
    <div class="liftData">
        <div class='infoBox'>
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
                    <div class="stop" v-if="liftData.DQFWMS === '2'"><img src="@/assets/stop.png"> </div>
                    <div class="check" v-if="liftData.DQFWMS === '3'"><img src="@/assets/check.png"> </div>
                    
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
                    <div>钢丝折弯次数:</div>
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
            <div class='xLine'>
            </div>
            <div class='statusInfo'>
                <div class="status">
                    <div class="label">
                        <div>运行状态</div>
                        <div>轿门状态</div>
                        <div>当前速度</div>
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
                    <div :class="[direction === 1? 'active':'']"><i class="iconfont icon-up1"></i></div>
                    <div :class="[direction === 2? 'active':'']"><i class="iconfont icon-down1"></i></div>
                    
                </div>
                <div class="line">
                    <div class="lineInner"></div>
                </div>
                <div class="angleInfo">
                    <div class="title">
                        角度
                    </div>
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
import {dqfwmsMap, jxyxztMap, jxyxfxMap, jmztMap} from '@/utils';
export default {
    name: 'liftData',
    data() {
        return {
            direction: 0,
            liftData: {
                DQFWMS: '1', // 当前服务模式
                JXYXZT: '运行', // 轿厢运行状态
                JXYXFX: '无方向', // 轿厢运行方向
                DQLC: '7', // 当前楼层
                JMZT: '1', // 轿门状态
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
                //this.socket = new WebSocket("ws://10.100.30.130:8080/message");
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
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

        },
        getMessage(msg) {
            console.log(msg.data);
            let msgData = JSON.parse(msg.data);
            for (var x = 0; x < msgData.length; x++) {
                Object.keys(this.liftData).forEach(key => {
                    if(msgData[x].code === key){
                        if(msgData[x].code==='XJD'|| msgData[x].code==='YJD'|| msgData[x].code==='ZJD'){
                            this.liftData[key] = (msgData[x].value).toFixed(2) +msgData[x].unit;
                        
                        }else{
                            this.liftData[key] = msgData[x].value + (msgData[x].unit? msgData[x].unit: '');
                        }
                        
                    }

                    //JXYXZT 轿厢运行状态
                    if (msgData[x].code==='JXYXZT') {
                        let match = false;
                        jxyxztMap.forEach(map => {
                            if (map.key === msgData[x].value) {
                                msgData.JXYXZT = map.value;
                                match = true;
                            }
                        })
                        if (!match) {
                            msgData.JXYXZT = '未知';
                        }
                        
                    }
                    //JXYXFX 轿厢运行方向
                    if (msgData[x].code==='JXYXFX') {
                        this.direction = msgData[x].value;
                        // jxyxfxMap.forEach(map => {
                        //     if (map.key === msgData[x].value) {
                        //         msgData.JXYXFX = map.value;
                        //     }
                        // })
                    }
                    //JMZT 轿门状态
                    if (msgData[x].code==='JMZT') {
                        let match = false;
                        jmztMap.forEach(map => {
                            if (map.key === msgData[x].value) {
                                msgData.JMZT = map.value;
                                match = true;
                            }
                        })
                        if (!match) {
                            msgData.JMZT = '未知';
                        }
                        
                    }

                });
                
            }
            
            if (msg && msg.data && msg.data.indexOf('}') !== -1) {
                //let msgData = JSON.parseArray(msg.data);
                //DQFWMS 当前服务模式
                // if (msgData.DQFWMS) {
                //     DQFWMSMap.forEach(map => {
                //        if (map.key === msgData.DQFWMS) {
                //           msgData.DQFWMS = map.value;
                //        }
                //     })
                // }

                
                
                this.liftData = {...this.liftData, ...msgData}
            }
        },    
        send(msg) {

            this.socket.send(msg)
        },
        close () {
            console.log("socket已经关闭");
            //释放资源

        }
    }
}
</script>
<style lang="less">
.liftData{
    padding: 30px 0;
    width: 768px;
    height: 456px;
    background-color:darkCyan;
    // border-radius: 60px;
    position: relative;
    overflow: hidden;
    .leftRoad{
        position: absolute;
        top: 58px;
        left: 0;
        width: 2px;
        height: 100%;
        background-color: #EDBD65;
        .block{
            display: none;
            position: absolute;
            width: 10px;
            height: 10px;
            top: 0;
            background-color: #EDBD65;
        }
    }
    .rightRoad{
        position: absolute;
        background-color: #EDBD65;
        top: 58px;
        right: 0;
        width: 2px;
        height: 100%;
        .block{
            display: none;
            position: absolute;
            width: 10px;
            height: 10px;
            top: 0;
            right: 0;
            background-color: #EDBD65;
        }
    }
    .block.upMove{
        animation:upMove 3s infinite linear;
    }
    .block.downMove{
        animation:downMove 3s infinite linear;
    }
    .infoBox{
        height: 400px;
        width: 700px;
        border: 5px solid white;
        // border-radius: 40px;
        margin: 20px auto;
        padding: 0 10px;
        color: white;
        .currentInfo {
            float: left;
            height: 127px;
            width: 30%;
            padding: 20px 0;
            .label{
                width: 20%;
                float: left;
                i{
                    font-size: 26px;
                }
                &>div{
                    height: 46px;
                    line-height: 46px;
                }
            }
            .value {
                width: 80%;
                float: left;
                font-size: 24px;
                &>div{
                    height: 46px;
                    line-height: 46px;
                    text-align: left;
                }
            }
        }
        .importantInfo{
            float: left;
            height: 127px;
            width: 30%;
            padding: 20px 0;
            .runInfo{
                height: 100%;
                .floor{
                    line-height: 127px;
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
            height: 127px;
            width: 30%;
            .label{
                width: 70%;
                float: left;
                &>div{
                    font-size: 18px;
                    text-align: left;
                    height: 34px;
                    line-height: 34px;
                }
            }
            .value{
                width: 30%;
                float: left;
                &>div{
                    font-size: 18px;
                    text-align: left;
                    height: 34px;
                    line-height: 34px;
                }
            }
        }
        .line{
            margin: 40px 0; 
            float: left;
            width: 5%;
            height: 87px;
            text-align: center;
            .lineInner{
                height: 150%;
                width: 4px;
                background-color: white;
                display: inline-block;
                border-radius: 4px;
            }
        }
        .xLine{
            height: 3px;
            position: absolute;
            width: 700px;
            background: white;
            top: 250px;
        }
    }
    .statusInfo{
        .status{
            float: left;
            height: 127px;
            padding: 50px 0;
            width: 30%;
            .label{
                width: 50%;
                float: left;
                font-size: 18px;
                &>div{
                    height: 36px;
                    line-height: 36px;
                }
            }
            .value {
                width: 50%;
                float: left;
                font-size: 18px;
                &>div{
                    text-align: left;
                    height: 36px;
                    line-height: 36px;
                }
            }
        }
        .direction{
            float: left;
            height: 127px;
            width: 30%;
            padding: 60px 0;
            >div{
                width: 50%;
                float: left;
                height: 127px;
                line-height: 127px;
                i{
                    font-size: 100px;
                }
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
            padding: 50px 0;
            width: 30%;
            height: 127px;
            color: white;
            .title{
                text-align: center;
                height: 20px;
                line-height: 20px;
                margin: 6px;
            }
            .item{
                height: 28px;
                line-height: 28px;
            }
            .label{
                margin: 0 20px;
                float: left;
            }
            .value{
                float: left;
            }
        }
    }
}
</style>
