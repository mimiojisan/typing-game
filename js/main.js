Vue.config.devtools = true;

new Vue({
    el: "#app",
    data : {
        // 開始 / 終了フラグ
        startFlg : "",
        endFlg: "",
        // 配列 [ 質問 / 格納 ]
        questions : [
             'computed',
             'methods',
             'mounted',
             'watch',
             'component',
             'data',
             'created',
             'el',
             'filters',
             'template',
             'slice'
        ],
        Answers : [],
        typeBox : "",
        // 件数
        current_question_counts : 0,
        question_counts : 0,
        // タイピング
        missed : 0,
        totalTyped : 0,
        // ストップウォッチ
        startTime: 0,  // 開始時刻
        pastTime: 0, // 経過時刻
        timerObj: null,
    },
    computed : {
        // 正解ゲージの設定
        styleObject: function() {
            // MAXを100%で考える
            width_value = 100 / this.questions.length
            width = width_value * this.current_question_counts + "%";
            if (this.current_question_counts == this.questions.length) {
                color = "#03a9f4"
            } else {
                color = "orange"
            }
            // 長さ(横幅)と色を返す
            return {
                'width': width,
                'background-color':color
            };
        },
        currentWord() {
            // 既出の問題を除いてランダムで出力
            const noAnswers = this.questions.filter((word) => {
                return (!this.Answers.includes(word)) //未回答
            })
            const randomIndex = Math.floor(Math.random() * noAnswers.length);
            return noAnswers[randomIndex]
        },
        // 時
        m(){
            var m = Math.floor( this.pastTime / 60000 % 60 )
            return ( '0' + m ).slice(-2)
        },
        // 分
        s(){
            var s = Math.floor( this.pastTime / 1000 % 60 )
            return ( '0' + s ).slice(-2)
        },
        // 秒    
        ms(){
            var ms = Math.floor( this.pastTime / 10 )
            return ( '0' + ms ).slice(-2)
        }
    },
    methods : {
        countUp(){
            return this.pastTime = Date.now() - this.startTime
        },
        // スタートボタンをクリックした時の動作
        // 開始時
        start(){
            this.startFlg = true;
            // カーソル位置の指定
            this.$nextTick(function() {
                document.getElementById('typeForm').focus();
            })
            this.startTime = Date.now()
            var self = this
            
            this.timerObj = setInterval(function(){
            self.countUp()
            },10)
        },
        // ストップボタンをクリックした時の動作
        // 終了時
        stop(){
            clearInterval( this.timerObj )
            this.startTime = 0
            this.endFlg = true;
        },
        // リセットボタンをクリックした時の動作
        // やり直し時
        reset(){
            this.stop()
            this.pastTime = 0
            this.timerObj = null
            this.startFlg = false
            this.endFlg = false
            this.Answers = []
            this.current_question_counts = 0
            this.totalTyped = 0
        }
    },
    // 描画された時に表示される
    mounted : function() {
        this.question_counts = this.questions.length;
    },
    // 値の監視
    watch : {
        typeBox : function(e) {
            // 入力値と問題の文字列が同じ場合
            if (e == this.currentWord) {
                this.Answers.push(this.currentWord);
                this.typeBox = "";
                this.current_question_counts = this.current_question_counts + 1;
            }
            this.totalTyped++
        }
    }
}); 