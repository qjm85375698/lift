<template>
    <div class="liftModel">
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
                    <div class="check" v-if="liftData.DQFWMS === '2'"><img src="@/assets/check.png"> </div>
                    <div class="stop" v-if="liftData.DQFWMS === '3'"><img src="@/assets/stop.png"> </div>
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
        </div>
        <div class='liftBox'>
            <div class='liftDiv'>
                <!-- <div class="liftId">ID88888</div> -->
                <div class='liftInner'>
                    <div :class="{
                        'door': true,
                        'left': true,
                        'close': liftData.JMZT === '1',
                        'open': liftData.JMZT === '2',
                        'opening': liftData.JMZT === '3',
                        'closing': liftData.JMZT === '4',
                    }"></div>
                    <div :class="{
                        'door': true,
                        'right': true,
                        'close': liftData.JMZT === '1',
                        'open': liftData.JMZT === '2',
                        'opening': liftData.JMZT === '3',
                        'closing': liftData.JMZT === '4',
                    }"></div>
                </div>
                <div class='buttonBox'>
                    <div id="floorBox" class='floorBox'>{{liftData.DQLC}}-{{liftData.DQSD}}</div>
                    <div :class="['button', liftData.JXYXFX === '3'? 'active':'']"></div>
                    <div :class="['button', liftData.JXYXFX === '2'? 'active':'']"></div>
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
            <div class='liftPng'>
                <img src='@/assets/lift.png'>
            </div>
        </div>
        <div class="leftRoad" v-if="liftData.JXYXFX === '2' || liftData.JXYXFX === '3'">
            <div :class="['block', liftData.JXYXFX === '2'? 'upMove': 'downMove']"></div>
        </div>
        <div class="rightRoad" v-if="liftData.JXYXFX === '2' || liftData.JXYXFX === '3'">
            <div :class="['block', liftData.JXYXFX === '2'? 'upMove': 'downMove']"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'liftModel',
    data() {
        return {
            serveMode: 1,
            liftData: {
                DQFWMS: '正常运行', // 当前服务模式
                JXYXZT: '运行', // 轿厢运行状态
                JXYXFX: '1', // 轿厢运行方向
                DQLC: '7', // 当前楼层
                JMZT: '开门到位', // 轿门状态
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
    computed: {
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
            console.log("连接错误")
        },
        // 服务模式发生了改变
        modelChange() {
            // if (this.serveMode === '1') {

            // } else (this.serveMode === '2'){

            // } else (this.serveMode === '3'){

            // }
        },
        getMessage(msg) {
            // if (msg && msg.data && msg.data.indexOf('}') !== -1) {
            //     let msgData = JSON.parse(msg.data);
            //     if (msgData.DQFWMS && msgData.DQFWMS !== this.serveMode) {
            //         this.serveMode = msgData.DQFWMS;
            //         this.modelChange();
            //     }
            //     this.liftData = {...this.liftData, ...msgData}
            // }

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

                    // //JXYXZT 轿厢运行状态
                    // if (msgData[x].code==='JXYXZT') {
                    //     let match = false;
                    //     jxyxztMap.forEach(map => {
                    //         if (map.key === msgData[x].value) {
                    //             msgData.JXYXZT = map.value;
                    //             match = true;
                    //         }
                    //     })
                    //     if (!match) {
                    //         msgData.JXYXZT = '未知';
                    //     }
                        
                    // }
                    // //JXYXFX 轿厢运行方向
                    // if (msgData[x].code==='JXYXFX') {
                    //     this.direction = msgData[x].value;
                    //     // jxyxfxMap.forEach(map => {
                    //     //     if (map.key === msgData[x].value) {
                    //     //         msgData.JXYXFX = map.value;
                    //     //     }
                    //     // })
                    // }
                    // //JMZT 轿门状态
                    // if (msgData[x].code==='JMZT') {
                    //     let match = false;
                    //     jmztMap.forEach(map => {
                    //         if (map.key === msgData[x].value) {
                    //             msgData.JMZT = map.value;
                    //             match = true;
                    //         }
                    //     })
                    //     if (!match) {
                    //         msgData.JMZT = '未知';
                    //     }
                        
                    // }

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
            console.log("socket已经关闭")
        }
    }
}
</script>
<style lang="less">
.liftModel{
    padding: 30px 0;
    width: 700px;
    background-color:darkCyan;
    border-radius: 60px;
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
        height: 167px;
        width: 600px;
        border: 2px solid white;
        border-radius: 40px;
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
                width: 60%;
                float: left;
                &>div{
                    text-align: left;
                    height: 24px;
                    line-height: 24px;
                }
            }
            .value{
                width: 40%;
                float: left;
                &>div{
                    text-align: left;
                    height: 24px;
                    line-height: 24px;
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
                height: 100%;
                width: 4px;
                background-color: white;
                display: inline-block;
                border-radius: 4px;
            }
        }
    }
    .liftBox{
        height: 590px;
        width: 500px;
        margin: 0 auto;
        position: relative;
        .liftDiv{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            .liftId{
                position: absolute;
                width: 120px;
                height: 24px;
                z-index: 1;
                left: 173px;
                top: 26px;
                line-height: 24px;
            }
            .angleInfo{
                position: absolute;
                width: 95px;
                height: 120px;
                right: 2px;
                bottom: 49px;
                z-index: 1;
                border-radius: 10px;
                border: 2px solid white;
                color: white;
                .title{
                    text-align: center;
                    height: 20px;
                    line-height: 20px;
                    margin: 6px;
                }
                .item {
                    height: 28px;
                    line-height: 28px;
                }
                .label{
                    margin: 0 10px;
                    float: left;
                }
                .value{
                    float: left;
                }
            }
            .liftInner{
                overflow: hidden;
                position: absolute;
                top: 51px;
                right: 129px;
                left: 23px;
                bottom: 48px;
                .door{
                    position: absolute;
                    height: 100%;
                    width: 50%;
                    background-color: rgba(255,255,255,.25);
                }
                .left{
                    &.close{
                        left: 0;
                    }
                    &.open{
                        left: -100%;
                    }
                    &.opening{
                        animation: openLeftDoor 3s infinite linear;
                    }
                    &.closing{
                        animation: closeLeftDoor 3s infinite linear;
                    }
                }
                .right{
                    &.close{
                        right: 0;
                    }
                    &.open{
                        right: -100%;
                    }
                    &.opening{
                        animation: openRightDoor 3s infinite linear;
                    }
                    &.closing{
                        animation: closeRightDoor 3s infinite linear;
                    }
                }
            }
            .buttonBox{
                position: absolute;
                right: 9px;
                width: 119px;
                height: 236px;
                top: 177px;
                .floorBox{
                    position: absolute;
                    margin: 4px auto;
                    left: 22px;
                    right: -7px;
                    z-index: 1;
                    height: 34px;
                    padding: 2px;
                    background-color: darkCyan;
                    border-radius: 10px;
                    color: white;
                    font-family: "led regular";
                    line-height: 34px;
                    font-size: 24px;
                    font-style: oblique;
                }
                .button {
                    height: 50%;
                }
                .button.active{
                    background-color: red;
                }
            }
        }
        .liftPng{
            position:absolute;
            img{
                width: 500px;
                height: 590px;
            }
        }
    }
}
</style>
