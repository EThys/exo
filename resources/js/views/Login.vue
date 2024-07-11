<template>
    <div id="login">
        <div class="row w-75 bg-light rounded">
            <div class="col-12 col-md-6 bg-dark d-flex justify-content-center align-items-center py-5">
                <div class="d-flex flex-column text-center pt-2">
                    <img class="mx-auto" :src="logo" width="192" height="192">
                    <h1 class="mt-2 text-white">
                        Soficom
                    </h1>
                </div>
            </div>
            <div class="col-12 col-md-6 py-5">
                <div class="title">
                    <h1>Connexion</h1>
                </div>
                <form v-if="!twoFactor" class="ticketsForm" ref="myForm" @submit.prevent="onSubmit">
                    <div>
                        <label for="identification">Identifiant</label>
                        <input type="text"
                            id="identification"
                            name="text"
                            v-model="UserName"
                            
                            class="k-textbox" />
                    </div>
                    <div>
                        <label for="identification">Mot de passe</label>
                        <input type="password"
                            id="password"
                            name="password"
                            v-model="Password"
                            
                            class="k-textbox" />
                    </div>

                    <div class="licence">
                        En cliquant sur Connexion, vous acceptez notre 
                        <a href="#">accord de licence.</a>
                        <br>
                        <br>
                        <a href="#" @click.prevent="showTips = true">J'ai oublié mon identifiant ou mon mot de passe.</a>
                    </div>
                    <div>
                        <button v-if="status !== 'loading'" class="btn btn-dark" type="submit">
                            <i class="fa fa-sign-in-alt"></i> Connexion
                        </button>
                        <p v-else style="color: green">
                            <span class="k-icon k-i-reload"></span> Verification
                        </p>
                    </div>
                </form>
                <form v-else class="ticketsForm" ref="codeForm mt-5" @submit.prevent="OnCodeValidate">
                    <div>
                        <label for="code">Entrez le code</label>
                        <input type="text"
                            id="code"
                            name="text"
                            v-model="Code"
                            class="k-textbox" />
                    </div>
                    <div>
                        <button v-if="status !== 'loading'" class="btn btn-dark" type="submit">
                            <i class="fa fa-sign-in-alt"></i> Verifier
                        </button>
                        <p v-else style="color: green">
                            <span class="k-icon k-i-reload"></span> Verification
                        </p>
                    </div>
                </form>
            </div>
        </div>
        <div class="tips" v-dragged="onDragged" v-if="showTips">
            <div class="card text-white bg-danger mb-3 w-100 h-100" style="max-width: 18rem;">
                <div class="card-header"><i class="fa fa-question-circle"></i> Aide</div>
                <div class="card-body">
                    <p>Pour des mesures de securiter veuillez contacter ces numeros:</p>
                    <table class="table table-striped table-borderless table-hover table-sm">
                        <tbody>
                            
                            <tr>
                                <td>Tel 1</td>
                                <td>0818303419</td>
                            </tr>
                            <tr>
                                <td>Tel 2</td>
                                <td>0818303447</td>
                            </tr>
                            <tr>
                                <td>Tel 3</td>
                                <td>0817300081</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer text-right">
                    <button @click="showTips = false" class="btn btn-default btn-sm text-light">Fermer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data () {
        return {
            UserName: '',
            Password: '',
            showTips: false,
            twoFactor: false,
            Code: '',
            UserID: null,
            logo: `/images/${window.myprovider}.png`
        }
    },
    computed: {
        ...mapState({
            status: state => state.auth.status
        })
    },
    methods: {
        validate() {
            return this.UserName != '' && this.Password != ''
        },
        onSubmit: function (e) {
            e.preventDefault()
            if (this.validate()) {
                const { UserName, Password } = this
                this.$store.dispatch('auth/login', { UserName, Password })
                    .then((resp) => {
                        this.twoFactor = true
                        this.UserID = resp.data.id
                        // this.$router.push('/absences')
                    })
                    .catch(err => {
                        if (!err.response) {
                            this.$toasted.global.my_app_error({
                                message: 'Network Error, please check your internet.'
                            });
                        } else {
                            this.$toasted.global.my_app_error({
                                message: err.response.data.message
                            });
                        }
                    })
            } else {
                this.$toasted.global.my_app_error({
                    message: 'Veuillez entrer vos informations!'
                });
            }
        },
        OnCodeValidate: function (e) {
            e.preventDefault()
            if (this.Code)
            {
                this.$store.dispatch('auth/verifyCode', { Code: this.Code, UserID: this.UserID })
                    .then(() => {
                        this.$router.push('/')
                    })
                    .catch(err => {
                        if (!err.response) {
                            this.$toasted.global.my_app_error({
                                message: 'Network Error, please check your internet.'
                            });
                        } else {
                            this.$toasted.global.my_app_error({
                                message: err.response.data.message
                            });
                        }
                    })
            } else {
                this.$toasted.global.my_app_error({
                    message: 'Enter le code recu par sms'
                });
            }
        },
        logout: function () {
            this.$store.dispatch('auth/logout')
                .then(() => {
                    this.$router.push('/login')
                })
        },
        onDragged({ el, deltaX, deltaY, offsetX, offsetY, clientX, clientY, first, last }) {
            if (first) {
                this.isDragging = true
                return
            }
            if (last) {
                this.isDragging = false
                return
            }
            var l = +window.getComputedStyle(el)['left'].slice(0, -2) || 0
            var t = +window.getComputedStyle(el)['top'].slice(0, -2) || 0
            el.style.left = l + deltaX + 'px'
            el.style.top = t + deltaY + 'px'
        },
    }
}
</script>

<style scoped>
    #login {
        width: 100%;
        height: 100%;
        background-color: #28a745;
        /* background-image: url('/images/maxresdefault.jpg'); */
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: scroll;
    }

    .pub-block {
        flex: 1;
        height: 100%;
        background: #000;
        border-top: 5px solid #fff;
        border-left: 5px solid #fff;
        border-bottom: 5px solid #fff;
        box-sizing: border-box;
    }

    .title {
        text-align: center;
    }
    h1 {
        font-weight: 300;
        font-family: "Metric", Helvetica, Arial, sans-serif;
        line-height: .8em;
        letter-spacing: -0.02em;
    }
    .k-button, .status {
        margin-top: 10px;
    }
    .invalid {
        color: red;
    }
    .valid {
        color: green;
    }
    .ticketsForm {
        margin: 0 10px;
        display: flex;
        flex-direction: column;
    }
    .ticketsForm  > div {
        align-self: center;
        width: 70%;
        margin-top: 15px;
    }
    .ticketsForm  input {
        margin-top: 5px;
        width: 100%;
    }
    .licence {
        font-size: .8em;
        color: rgba(0, 0, 0, .8)
    }
    .licence a {
        color: #000;
        outline: none;
    }

    @-moz-keyframes spin {
        from { -moz-transform: rotate(0deg); }
        to { -moz-transform: rotate(360deg); }
    }
    @-webkit-keyframes spin {
        from { -webkit-transform: rotate(0deg); }
        to { -webkit-transform: rotate(360deg); }
    }
    @keyframes spin {
        from {transform:rotate(0deg);}
        to {transform:rotate(360deg);}
    }

    .k-icon.k-i-reload {
        -webkit-animation: spin 2s infinite linear;
        animation: spin .6s infinite linear;
    }

    .error {
        color: red;
        margin: 0 5px 0 5px;
    }

    .tips {
        width: 300px;
        height: 350px;
        left: 50%;
        top: 50%;
        margin-left: -150px;
        margin-top: -150px;
        position: absolute;
        z-index: 2;
    }
</style>
