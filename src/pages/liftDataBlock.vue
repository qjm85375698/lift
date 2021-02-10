<template>
  <div class="liftDataBlock">
    <el-row :gutter='40' v-for='(element, index) in convertLiftData' :key="index">
      <el-col :span='12'>
        <div class="group">
          <div class='label'>{{element.label1}}</div>
          <div class='symbol'>-</div>
          <div class='value'>{{element.value1}}</div>
        </div>
      </el-col>
      <el-col :span='12' v-if="element.key2">
        <div class="group">
          <div class='label'>{{element.label2}}</div>
          <div class='symbol'>-</div>
          <div class='value'>{{element.value2}}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {dqfwmsMap, jxyxztMap, jxyxfxMap, jmztMap} from '@/utils';
export default {
    name: 'LiftDataBlock',
    created() {
        this.initSocket();
    },
    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    },
    data() {
        return {
            liftData: [
                {
                    key: 'dqfwms',
                    label: '当前服务模式',
                    value: '正常运行'
                }, {
                    key: 'jxyxzt',
                    label: '轿厢运行状态',
                    value: '运行'
                }, {
                    key: 'jxyxfx',
                    label: '轿厢运行方向',
                    value: '无方向'
                }, {
                    key: 'dqdtlc',
                    label: '当前楼层',
                    value: '0'
                }, {
                    key: 'jmzt',
                    label: '轿门状态',
                    value: '开门到位'
                }, {
                    key: 'dtljyxcs',
                    label: '累计运行次数',
                    value: '1945'
                }, {
                    key: 'dtkmcs',
                    label: '累计开门次数',
                    value: '1945'
                }, {
                    key: 'dtljyxjl',
                    label: '累计运行距离',
                    value: '1945cm'
                }, {
                    key: 'dtgsszwcs',
                    label: '钢丝绳折弯次数',
                    value: '1945'
                }, {
                    key: 'dtdqyl',
                    label: '最大压力',
                    value: '101.32kpa'
                }, {
                    key: 'dtdqgd',
                    label: '当前高度',
                    value: '260cm'
                }, {
                    key: 'dtdqsd',
                    label: '当前速度',
                    value: '20m/s'
                }, {
                    key: 'dtxjd',
                    label: 'X角度',
                    value: '0°'
                }, {
                    key: 'dtyjd',
                    label: 'Y角度',
                    value: '0°'
                }, {
                    key: 'dtzjd',
                    label: 'Z角度',
                    value: '0°'
                }, {
                    key: 'dtljyxsj',
                    label: '累计运行时间',
                    value: '100s'
                }, {
                    key: 'jxwd',
                    label: '轿厢温度',
                    value: '25℃'
                }
            ],
            socket: null
        }  
    },
    methods: {
        initSocket() {
            if(typeof(WebSocket) === "undefined"){
                  alert("您的浏览器不支持socket")
            }else{
                const {query} = this.$route;
                const {id} = query || {};
                if (!id){
                    alert("请传电梯id")
                    return;
                }
                // 实例化socket
                this.socket = new WebSocket("ws://10.100.30.130:8080/myHandler/uid=" + id);
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open() {
            console.log("socket连接成功")
        },
        error() {
            console.log("连接错误")
        },
        getMessage(msg) {
            if (msg && msg.data && msg.data.indexOf('}') !== -1) {
                let msgData = JSON.parse(msg.data);
                let keys = Object.keys(msgData);
                keys && keys.forEach(key => {
                    this.liftData.forEach(data => {
                        if (data.key === key) {
                            data.value = msgData[key];
                        }
                    })
                })
            }
        },
        send() {
            this.socket.send(params)
        },
        close () {
            console.log("socket已经关闭")
        }
    },
    computed: {
        'convertLiftData': function() {
            const convertLiftData = [];
            this.liftData.forEach((data, index) => {
                let {key, label, value} = data;
                if (key === 'dqfwms') {
                    dqfwmsMap.forEach(map => {
                       if (map.key === value) {
                          value = map.value;
                       }
                    })
                }
                if (key === 'jxyxzt') {
                    jxyxztMap.forEach(map => {
                       if (map.key === value) {
                          value = map.value;
                       }
                    })
                }
                if (key === 'jxyxfx') {
                    jxyxfxMap.forEach(map => {
                       if (map.key === value) {
                          value = map.value;
                       }
                    })
                }
                if (key === 'jmzt') {
                    jmztMap.forEach(map => {
                       if (map.key === value) {
                          value = map.value;
                       }
                    })
                }
                if (index % 2 === 0) {
                    convertLiftData.push({
                        key1: key,
                        label1: label,
                        value1: value
                    })
                } else {
                  let object = convertLiftData[convertLiftData.length - 1]
                    object.key2 = key,
                    object.label2 = label;
                    object.value2 = value;
                }
            });
            return convertLiftData;
        }
    },
}
</script>

<style scoped lang="less">
.liftDataBlock {
    width: 700px;
    margin: 40px auto;
    .group {
        background-color: darkcyan;
        border: 1px solid white;
        height: 60px;
        border-radius: 12px;
        color: white;
        position: relative;
        .symbol{
            position: absolute;
            width: 12px;
            height: 12px;
            line-height: 12px;
            text-align: center;
            top: 50%;
            left: 50%;
            transform: translate(0,-50%);
        }
        .value,.label{
            width: 50%;
            float: left;
            line-height: 60px;
        }
        .value {
            width: 40%;
        }
        .label {
            width: 60%;
        }
    }
}
</style>
