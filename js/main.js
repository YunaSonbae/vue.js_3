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
        handleUpdateDate(card) {
            // Обработка обновления данных при изменении даты
            console.log('Дата обновлена', card);
            // В этом месте вы можете выполнить необходимые операции с данными
        }
    },
    mounted() {
        if ((JSON.parse(localStorage.getItem("column1")) != null)){
            this.column1 = JSON.parse(localStorage.getItem("column1"))
        }
        if ((JSON.parse(localStorage.getItem("column2")) != null)){
            this.column2 = JSON.parse(localStorage.getItem("column2"))
        }
        if ((JSON.parse(localStorage.getItem("column3")) != null)){
            this.column3 = JSON.parse(localStorage.getItem("column3"))
        }
        if ((JSON.parse(localStorage.getItem("column4")) != null)){
            this.column4 = JSON.parse(localStorage.getItem("column4"))
        }
        eventBus.$on('card-create', card => {
            this.column1.push(card)
            localStorage.setItem("column1", JSON.stringify(this.column1))

        })
        eventBus.$on('moving1', card => {
            JSON.parse(localStorage.getItem("column1"))
            this.column2.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
            localStorage.setItem("column2", JSON.stringify(this.column2))
            localStorage.setItem("column1", JSON.stringify(this.column1))
        })
        eventBus.$on('moving2', card => {
            JSON.parse(localStorage.getItem("column2"))
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
            localStorage.setItem("column2", JSON.stringify(this.column2))
            localStorage.setItem("column3", JSON.stringify(this.column3))

        })

        eventBus.$on('moving3-2', card => {
            JSON.parse(localStorage.getItem("column2"))
            JSON.parse(localStorage.getItem("column3"))
            this.column2.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateE = new Date().toLocaleDateString()
            localStorage.setItem("column2", JSON.stringify(this.column2))
            localStorage.setItem("column3", JSON.stringify(this.column3))
        })

        eventBus.$on('moving3-4', card => {
            JSON.parse(localStorage.getItem("column3"))
            this.column4.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateE = new Date().toLocaleDateString()
            card.dateE = card.dateE.split('.').reverse().join('-')
            if (card.dateE > card.dateD){
                card.inTime = false
            }

            localStorage.setItem("column3", JSON.stringify(this.column3))
            localStorage.setItem("column4", JSON.stringify(this.column4))
        })
        eventBus.$on('updateDate', this.handleUpdateDate);

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
            <p class="pForm">Введите заголовок:
              <input required type="text" v-model="title" maxlength="30" placeholder="Заголовок">
            </p>
            <p class="pForm">Добавьте описание задаче:</p>
            <textarea required v-model="description" cols="40" rows="4"></textarea>
             <p class="pForm">Выберите роль:
                            <select v-model="role">
                                <option value="бек">Бекенд</option>
                                <option value="фронт">Фронтенд</option>
                                <option value="дизайнер">Дизайнер</option>
                            </select>
                        </p>
            <p class="pForm">Укажите срок выполнения задачи:
              <input required type="date" v-model="dateD" @input="onDateInput">
            </p>
<!--            <p class="pForm">-->
<!--              <input class="button" type="submit" value="Добавить задачу">-->
<!--            </p>-->
          </form>
        </div>
      </div>
    </div>
  </div>
    `,
    data() {
        return {
            title: null,
            role: null,
            description: null,
            dateD: null,
            show: false
        };
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                dateD: this.dateD, //DateDEADLINE
                dateC: new Date().toLocaleString(), //DataCreate
                updateCard: false,
                dateL: null, //DateLAST
                dateE: null, //DataEND
                inTime: true, //IN TIME
                role: this.role,
                reason: []
            };
            eventBus.$emit('card-create', card);
            this.title = null;
            this.description = null;
            this.dateD = null;
            this.role = null;
            this.closeModal();
            console.log(card);
        },
        closeModal() {
            this.show = false;
        },
        openModal() {
            this.show = true;
        },
        onDateInput() {
            // Вызывается при вводе даты, здесь можно добавить логику для закрытия модального окна
            this.onSubmit();
            // Закрываем модальное окно
            this.closeModal();
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
                <li><b>Роль:</b> {{ card.role }}</li>
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
            JSON.parse(localStorage.getItem("column1"))
            this.column1.splice(this.column1.indexOf(card), 1)
            localStorage.setItem("column1", JSON.stringify(this.column1))        },
        updateC(card){
            card.updateCard = true
            console.log(card.updateCard)
        },
        updateTask(card){
            JSON.parse(localStorage.getItem("column1"))
            this.column1.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
            card.dateL = new Date().toLocaleString()
            localStorage.setItem("column1", JSON.stringify(this.column1))
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
                <li><b>Роль:</b> {{ card.role }}</li>
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
                        <p class="pForm">Укажите дату дедлайна:
                           <input required type="date" v-model="card.dateD" @input="onDateInput(card)">
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
            JSON.parse(localStorage.getItem("column2"))
            this.column2.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
            card.dateL = new Date().toLocaleString()
            localStorage.setItem("column2", JSON.stringify(this.column2))
            return card.updateCard = false
        },
        moving(card){
            eventBus.$emit('moving2', card)
        },
        onDateInput(card) {
            card.updateCard = true
            // Вызывается при вводе даты, здесь можно добавить логику для закрытия модального окна
            this.onSubmit();
            // Закрываем модальное окно
            this.closeModal();
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
                <li><b>Роль:</b> {{ card.role }}</li>
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
                              <input required type="date" v-model="card.dateD" @input="onDateInput(card)">                        </p>
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
            JSON.parse(localStorage.getItem("column3"))
            this.column3.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateL = new Date().toLocaleString()
            localStorage.setItem("column3", JSON.stringify(this.column3))
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
                <li><b>Роль:</b> {{ card.role }}</li>
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