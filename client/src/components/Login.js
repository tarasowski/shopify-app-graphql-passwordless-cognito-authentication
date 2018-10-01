import React, { Component } from 'react'
import { Page } from '@shopify/polaris'
import axios from 'axios'
import config from '../config'

const CALLBACK_URL = config.callbackUrl

class Login extends Component {
    state = {
        shopUrl: '',
        authData: {
            url: config.apiGInstallUrl,
            callback: `&callback-url=${CALLBACK_URL}/callback/`
        }
    }
    handleChange = (event) => {
        this.setState({ shopUrl: event })
    }
    handleSubmit = (event) => {
        event.preventDefault()
        const url = this.state.authData.url + this.state.shopUrl + this.state.authData.callback
        return axios.get(url)
            .then(res => {
                localStorage.setItem('token', res.data.token)
                window.location = res.data.authUrl
            })
    }
    componentDidMount = () => {
        const SHOP_ORIGIN = window.location.ancestorOrigins[0].slice(8)
        const url = this.state.authData.url + SHOP_ORIGIN + this.state.authData.callback
        return axios.get(url)
            .then(res => {
                localStorage.setItem('token', res.data.token)
                window.location = res.data.authUrl
            })

    }
    render() {
        return (
            <Page>
                <h1>Loading</h1>
                <p>Please wait...</p>
            </Page>
        )
    }
}

export default Login