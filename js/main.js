let eventBus = new Vue()

Vue.component('cards-kanban', {
    template:`
    <div>
        <fill></fill>
        <div id="columns">
            <column1 :column1="column1"></column1>
            <column2 :column2="column2"></column2>
            <column3 :column3="column3"></column3>
            <column4 :column4="column4"></column4>
        </div>
    </div>
    `,
    data() {
        return {
            column1:[],
            column2:[],
            column3:[],
            column4:[],
            showCard: true,
        }
    },
    methods:{

    },
    mounted() {
        eventBus.$on('card-create', card => {
            this.column1.push(card)
        })
        eventBus.$on('moving1', card => {
            this.column2.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)

        })
        eventBus.$on('moving2', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        })

        eventBus.$on('moving3-2', card => {
            this.column2.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateE = new Date().toLocaleDateString()
        })

        eventBus.$on('moving3-4', card => {
            this.column4.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateE = new Date().toLocaleDateString()
            card.dateE = card.dateE.split('.').reverse().join('-')
            console.log(card)
            if (card.dateE > card.dateD){
                card.inTime = false
            }
        })
    }
})

Vue.component('fill', {
    template:`
    <div>
    <div>
        <button class="button1" v-if="!show" @click="openModal">Добавьте задачу</button>
        <div id="form" v-if="show" class="modal-shadow">
            <div class="modal">
                <div class="modal-close" @click="closeModal">&#10006;</div>
                <h3>Заполните карточку задачи</h3>
                <form @submit.prevent="onSubmit">
                    <p class="pForm">Заголовок: 
                        <input required type="text" v-model="title" maxlength="30" placeholder="Заголовок">
                    </p>
                    <p class="pForm">Описание задаче:</p>
                    <textarea v-model="description" cols="40" rows="4"></textarea>
                    <p class="pForm">Срок выполнения задачи: 
                        <input required type="date" v-model="dateD">
                    </p>
                    <p class="pForm">
                        <input class="button" type="submit" value="Добавить задачу">
                    </p>
                </form>
            </div>
        </div>    
    </div>
    `,
    data(){
        return {
            title: null,
            description: null,
            dateD: null,
            show: false
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                dateD: this.dateD,                  //DateDEADLINE
                dateC: new Date().toLocaleString(),   //DataCreate
                updateCard: false,
                dateL: null,                            //DateLAST
                dateE: null,                            //DataEND
                inTime: true,                            //IN TIME
                reason: []
            }
            eventBus.$emit('card-create', card)
            this.title = null
            this.description = null
            this.dateD = null
            this.closeModal()
            console.log(card)
        },
        closeModal(){
            this.show = false
        },
        openModal(){
            this.show = true
        }
    }
})

Vue.component('column1', {
    props:{
        card: {
            type: Object,
            required: true
        },
        column1: {
            type: Array,
            required: true
        },
    },
    template:`
    <div class="column">
        <h3>Запланированные задачи</h3>
        <div class="card" v-for="card in column1">
            <ul>
                <li class="title"><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание задачи:</b> {{ card.description }}</li>
                <li><b>Дата дедлайна:</b> {{ card.dateD }}</li>
                <li><b>Дата создания:</b> {{ card.dateC }}</li>
                <li v-if="card.dateL"><b>Дата последних изменений</b>{{ card.dateL }}</li>
                <button @click="deleteCard(card)">Удалить</button>
                <button @click="updateC(card)">Изменить</button>
                <div class="change" v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Введите заголовок: 
                            <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                        </p>
                        <p>Добавьте описание задаче: 
                            <textarea v-model="card.description" cols="20" rows="5"></textarea>
                        </p>
                        <p>Укажите дату окончания срока: 
                            <input type="date" v-model="card.dateD">
                        </p>
                        <p>
                             <input class="button" type="submit" value="Изменить карточку">
                        </p>
                    </form>
                </div>
             </ul>
            <button @click="moving(card)">переместить</button>
        </div>
    </div>
    `,
    methods: {
        deleteCard(card){
            this.column1.splice(this.column1.indexOf(card), 1)
        },
        updateC(card){
            card.updateCard = true
            console.log(card.updateCard)
        },
        updateTask(card){
            this.column1.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
            card.dateL = new Date().toLocaleString()
            return card.updateCard = false
        },
        moving(card){
            eventBus.$emit('moving1', card)
        }
    },
})

Vue.component('column2', {
    props:{
        column2:{
            type: Array,
            required: true
        },
        card:{
            type:Object,
            required: true
        },
        reason:{
            type:Array,
            required: true
        }
    },
    template:`
    <div class="column">
        <h3>Задачи в работе</h3>
         <div class="card" v-for="card in column2">
            <ul>
                 <li class="title"><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание задачи:</b> {{ card.description }}</li>
                <li><b>Дата дедлайна:</b> {{ card.dateD }}</li>
                <li><b>Дата создания:</b> {{ card.dateC }}</li>
                <li v-if="card.dateL"><b>Дата последних изменений</b>{{ card.dateL }}</li>
                <li v-if="card.reason.length"><b>Комментарии: </b><li v-for="r in card.reason">{{ r }}</li></li>
                <button @click="updateC(card)">Изменить</button>
                 <div class="change" v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Введите заголовок: 
                            <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                        </p>
                        <p>Добавьте описание задаче: 
                            <textarea v-model="card.description" cols="20" rows="5"></textarea>
                        </p>
                        <p>Укажите дату дедлайна: 
                            <input type="date" v-model="card.dateD">
                        </p>
                        <p>
                            <input class="button" type="submit" value="Изменить карточку">
                        </p>
                    </form>
                </div>
            </ul>
            
             <button @click="moving(card)">переместить</button>
        </div>        
    </div>
    `,
    methods: {
        updateC(card){
            card.updateCard = true
            console.log(card.updateCard)
        },
        updateTask(card){
            this.column2.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
            card.dateL = new Date().toLocaleString()
            return card.updateCard = false
        },
        moving(card){
            eventBus.$emit('moving2', card)
        }
    },
})

Vue.component('column3', {
    props:{
        column3:{
            type: Array,
            required: true
        },
        card:{
            type:Object,
            required: true
        },
        reason:{
            type:Array,
            required: true
        }
    },

    template:`
    <div class="column">
        <h3>Тестирование</h3>
        <div class="card" v-for="card in column3">
            <ul>
                <li class="title"><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание задачи:</b> {{ card.description }}</li>
                <li><b>Дата дедлайна:</b> {{ card.dateD }}</li>
                <li><b>Дата создания:</b> {{ card.dateC }}</li>
                <li v-if="card.dateL"><b>Дата последних изменений: </b>{{ card.dateL }}</li>
                <li v-if="card.reason.length"><b>Комментарии: </b><li v-for="r in card.reason">{{ r }}</li></li>
                <li v-if="moveBack">
                    <form @submit.prevent="onSubmit(card)">
                        <textarea v-model="reason2" cols="20" rows="4"></textarea>
                        <input class="button" type="submit" value="Сохранить">
                    </form>
                </li>
                <button @click="updateC(card)">Изменить</button>
                 <div class="change" v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Введите заголовок: 
                            <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                        </p>
                        <p>Добавьте описание задаче: 
                            <textarea v-model="card.description" cols="20" rows="5"></textarea>
                        </p>
                        <p>Укажите дату дедлайна: 
                            <input type="date" v-model="card.dateD">
                        </p>
                        <p>
                              <input class="button" type="submit" value="Изменить карточку">
                        </p>
                    </form>
                </div>
            </ul>
            <button @click="movingBack">Сдвиг влево</button>
            <button @click="moving(card)">Сдвиг вправо</button>
        </div>    
    </div>
    `,

    data(){
        return{
            moveBack: false,
            reason2: null
        }
    },
    methods: {
        updateC(card){
            card.updateCard = true
            console.log(card.updateCard)
        },
        updateTask(card){
            this.column3.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateL = new Date().toLocaleString()
            return card.updateCard = false
        },
        moving(card){
            eventBus.$emit('moving3-4', card)
        },
        movingBack(){
            this.moveBack = true
        },
        onSubmit(card) {
            card.reason.push(this.reason2)
            eventBus.$emit('moving3-2', card)
            this.reason2 = null
            this.moveBack = false
        }
    },
})

Vue.component('column4', {
    props:{
        column4:{
            type: Array,
            required: true,
        },
        card: {
            type: Object,
            required: true
        }
    },
    template:`
    <div class="column">
        <h3>Выполненные задачи</h3>
         <div class="card" v-for="card in column4">
            <ul>
                 <li class="title"><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание задачи:</b> {{ card.description }}</li>
                <li><b>Дата создания:</b> {{ card.dateC }}</li>
                <li><b>Дата выполнения:</b> {{ card.dateC }}</li>
                <li><b>Дата дедлайна:</b> {{ card.dateD }}</li>
                <li id="inTime" v-if="card.inTime">Задача выполнена в срок!</li>
                <li id="notInTime" v-else>Задача выполнена не в срок!</li>
            </ul>
        </div>
    </div>
    `,
    methods: {

    },
})

let app = new Vue({
    el:'#app',
    data:{

    }
})