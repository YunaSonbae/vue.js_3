let eventBus = new Vue()

Vue.component('cols', {
    template: `
 <section id="main" class="main-alt">
        <p class="main__text">Kanban</p>
    <div class="columns">
    <newCard></newCard>
        <column_1 :column_1="column_1"></column_1>
        <column_2 :column_2="column_2"></column_2>
        <column_3 :column_3="column_3"></column_3>  
        <column_4 :column_4="column_4"></column_4>       
    </div>
 </section>
    `,
    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
            column_4: [],
        }
    },
    mounted() {
        eventBus.$on('addColumn_1', card => {
            this.column_1.push(card)
        })
        eventBus.$on('addColumn_2', card => {
            this.column_2.push(card)
        })
        eventBus.$on('addColumn_3', card => {
            this.column_3.push(card)
        })
        eventBus.$on('addColumn_4', card => {
            this.column_4.push(card)

            if (card.date > card.deadline) {
                card.period = false
            }
        })
    },
})

Vue.component('column_1', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__one">
            <p>Запланированные задачи</p>
                <div class="card" v-for="card in column_1">
                   <a @click="deleteCard(card)" style="color: red">Удалить</a>  <a @click="card.edit = true" style="color: green">Редактировать</a>
                   <div class="tasks">Название: {{ card.name }}</div>

                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                    <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>
                                     <a @click="nextColumn(card)" style="color: mediumblue">Следующая колонка</a>
                    <div class="tasks" v-if="card.edit">
                        <form @submit.prevent="updateTask(card)">
                            <p>Новое название: 
                                <input type="text" v-model="card.name" placeholder="Название">
                            </p>
                            <p>Новое описание: 
                                <textarea v-model="card.description"></textarea>
                            </p>
                            <p>
                                <input type="submit" class="btn" value="Изменить карточку">
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_1: {
            type: Array,
        },
        column_2: {
            type: Array,
        },
        card: {
            type: Object
        },
    },
    methods: {
        nextColumn(card) {
            this.column_1.splice(this.column_1.indexOf(card), 1)
            eventBus.$emit('addColumn_2', card)
        },
        deleteCard(card) {
            this.column_1.splice(this.column_1.indexOf(card), 1)
        },
        updateTask(card) {
            card.edit = false
            this.column_1.push(card)
            this.column_1.splice(this.column_1.indexOf(card), 1)
            card.editDate = new Date().toLocaleString()
        },
    },
})

Vue.component('column_2', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__two">
            <p>Задачи в работе</p>
                <div class="card" v-for="card in column_2">
                   <a @click="card.edit = true" style="color: green">Редактировать</a>
                   <div class="tasks">Название: {{ card.name }}</div>

                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                    <div class="tasks" v-if="card.reason.length">Причина переноса: <p v-for="reason in card.reason">{{ reason }}</p></div>
                    <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>
                    <a @click="nextColumn(card)" style="color: mediumblue">Следующая колонка</a>
                    <div class="tasks" v-if="card.edit">
                        <form @submit.prevent="updateTask(card)">
                            <p>Новое название: 
                                <input type="text" v-model="card.name" placeholder="Название">
                            </p>
                            <p>Новое описание: 
                                <textarea v-model="card.description"></textarea>
                            </p>
                            <p>
                                <input type="submit" class="btn" value="Изменить карточку">
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_2: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        nextColumn(card) {
            this.column_2.splice(this.column_2.indexOf(card), 1)
            eventBus.$emit('addColumn_3', card)
        },

        updateTask(card) {
            card.editDate = new Date().toLocaleString()
            card.edit = false
            this.column_2.push(card)
            this.column_2.splice(this.column_2.indexOf(card), 1)
        }
    }
})

Vue.component('column_3', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__three">
            <p>Тестирование</p>
                <div class="card" v-for="card in column_3">
                   <a @click="card.edit = true" style="color: green">Редактировать</a>
                   <div class="tasks">Название: {{ card.name }}</div>
                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                    <div class="tasks" v-if="card.reason.length">Причина переноса: <p v-for="reason in card.reason">{{ reason }}</p></div>
                    <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>
                    <a @click="card.transfer = true" style="color: mediumblue">Предыдущая колонка</a><br>
                    <a @click="nextColumn(card)" style="color: mediumblue">Следующая колонка</a>
                    <div class="tasks" v-if="card.edit">
                        <form @submit.prevent="updateTask(card)">
                            <p style="font-size: ">Новое название: 
                                <input type="text" v-model="card.name" placeholder="Название">
                            </p>
                            <p>Новое описание: 
                                <textarea v-model="card.description"></textarea>
                            </p>
                            <p>
                                <input type="submit" class="btn" value="Изменить карточку">
                            </p>
                        </form>
                    </div>
                    <div class="tasks" v-if="card.transfer">
                        <form @submit.prevent="lastColumn(card)">
                            <p>Причина переноса:
                                <input type="text" id="reasonInput">
                            </p>
                            <p>
                                <input type="submit" value="Перенос">
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_3: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        nextColumn(card) {
            this.column_3.splice(this.column_3.indexOf(card), 1)
            eventBus.$emit('addColumn_4', card)
        },
        lastColumn(card) {
            let reasonValue = document.getElementById('reasonInput').value;
            card.reason.push(reasonValue)
            card.transfer = false
            this.column_3.splice(this.column_3.indexOf(card), 1)
            eventBus.$emit('addColumn_2', card)
        },
        updateTask(card){
            card.editDate = new Date().toLocaleString()
            card.edit = false
            this.column_3.push(card)
            this.column_3.splice(this.column_3.indexOf(card), 1)
        }
    }
})

Vue.component('column_4', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__four">
            <p>Выполненные задачи</p>
                <div class="card" v-for="card in column_4">
                    <div class="tasks">Название: {{ card.name }}</div>
                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
<!--                    <div class="tasks" v-if="card.deadline >= card.efDate" style="color: green">Завершено вовремя</div>-->
<!--                    <div class="tasks" v-if="card.deadline < card.efDate" style="color: red">Завершено не вовремя</div>-->
                        <div class="tasks" v-if="card.period" style="color: green">Завершено вовремя</div>
                        <div class="tasks" v-else style="color: red">Завершено не вовремя</div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_4: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
})

Vue.component('newCard', {
    template: `
<section>
<a href="#openModal" class="btn btnModal">Создать карточку</a>
<div id="openModal" class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Название</h3>
        <a href="#close" title="Close" class="close">×</a>
      </div>
      <div class="modal-body">    
    <div class="addForm">
        <form @submit.prevent="onSubmit">
            <div class="form__control">
                <div class="form__name field">

                    <input id="point" required v-model="name" type="text" placeholder="Название">
                </div>
            <div class="field">

                <textarea required id="point" v-model="description" placeholder="Описание"> </textarea>
            </div>
            <div class="field">

                <input required type="date" id="point" v-model="deadline">
            </div>
            <button type="submit" class="btn" @click="persist">Добавить</button>
            </div>
        </form>
    </div>
          </div>
    </div>
  </div>
</div>
</section>
`,
    data() {
        return {
            name: null,
            description: null,
            date: null,
            deadline: null
        }
    },
    methods: {
        onSubmit() {
            let card = {
                name: this.name,
                description: this.description,
                date: new Date().toLocaleDateString().split(".").reverse().join("-"),
                deadline: this.deadline,
                reason: [],
                transfer: false,
                edit: false,
                editDate: null,
                period: true
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null
            this.description = null
            this.date = null
            this.deadline = null
        },
        persist() {
            localStorage.name = this.name;
            localStorage.description = this.description;
            localStorage.deadline = this.deadline;
        }
    },
    mounted() {
        if(localStorage.name) this.name = localStorage.name;
        if(localStorage.description) this.description = localStorage.description;
        if(localStorage.deadline) this.deadline = localStorage.deadline;
    },
})

let app = new Vue({
    el: '#app',
})
