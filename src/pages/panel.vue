<template>
<div id="app">
    <div>
         <div id="main" :option="option" style="width:500px;height:500px" ref="chart"></div>
    </div>
</div>
</template>
<script>
export default{
       name: 'panelData',
       data() {
        return {
            socket: null,
            //myChart:'',
            panelData:'',
        }
    },
  created() {
    this.initSocket();
  },
  destroyed () {
    // 销毁监听
    this.socket.onclose = this.close
  },
//在Chart.vue中加入watch
  watch:{
    //观察option的变化
    panelData(msg){
      this.initCharts();
    }

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
            //this.socket.onclose=this.close;
        }
        //
        this.initCharts();
    },
    open() {
        const {query} = this.$route;
        const {device_key} = query || {};
        const {accessToken} = query || {};
        console.log('access_token:'+accessToken);
        if (!device_key){
            alert("请输入device_key")
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
                if(msgData[x].code === 'OXYGEN_PRESSURE'){
                        // 这个会将所有的非字符变成字符
                        //console.log(this.panelData[key]+' ==== '+msgData[x].value);
                        this.panelData = msgData[x].value;
                    }
        }

        // var temp = this.option;
        // console.log('temp.series[0].data'+temp.series[0].data);
        // temp.series[0].data=130;
        // this.myChart.setOption(temp);

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

    },
　　initCharts () {
        //this.myChart = echarts.init(document.getElementById('main'));
    　　let myChart = this.$echarts.init(this.$refs.chart);
        myChart.clear();
    　　console.log(this.$refs.chart)
    　　// 绘制图表
    　　myChart.setOption({
            // 　　title: { text: '在Vue中使用echarts' },
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%',
                },
                series: [{
                    name: 'Pressure',
                    type: 'gauge',
                    detail: {
                        formatter: '{value}'
                    },
                    data: [{
                        value: this.panelData,
                        name: '氧气压力'
                    }],
                    min:-100,
                    max: 1000,
                    interval:150
                }]
        　　});

　　    }
　  },
　  mounted () {
　　    this.initCharts();
　  }
}
</script>