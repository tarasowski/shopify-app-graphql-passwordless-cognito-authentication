import React, { Component } from 'react'
import { Page } from '@shopify/polaris'
import { Auth } from 'aws-amplify'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import config from '../config'



class Callback extends Component {
    state = {
        callbackSuccess: false,
        loadError: false,
        errorMessage: null
    }
    getData = async () => {
        const urlParameters = window.location.search.substring(1)
        const transformUrlArray = (urlArray) => {
            return urlArray.map(element => {
                let key, value
                const splitted = element.split('=')
                key = splitted[0]
                value = splitted[1]
                return {
                    [key]: value
                }
            })
        }

        const constructArrayFromUrl = (urlParamters) => {
            const urlArray = urlParameters.split('&')
            return transformUrlArray(urlArray)
        }

        const reduceUrlArrayToObject = (array) => {
            return array.reduce((curr, val) => Object.assign(curr, val), {})
        }

        const params = reduceUrlArrayToObject(constructArrayFromUrl(urlParameters))
        const token = localStorage.getItem('token')

        const response = await axios.post(config.apiGCallbackUrl, {
            params,
            token
        })

        return response
    }
    cognitoAuth() {

    }
    componentDidMount = async () => {
        const response = await this.getData()
        const data = JSON.parse(response.config.data)
        const token = data.token
        const shop = data.params.shop
        const userName = shop.replace(".myshopify.com", "@myshopify.com")
        try {
            const user = await Auth.signIn(userName)
            console.log(user)
            console.log('this is my token', token)
            if (user.challengeName === 'CUSTOM_CHALLENGE') {
                await Auth.sendCustomChallengeAnswer(user, token)
                this.setState({
                    callbackSuccess: true,
                    errorMessage: null,
                })
            }
        } catch (err) {
            console.log(err)
            this.setState({
                callbackSuccess: false,
                errorMessage: "Expected Custom Challenge",
                loadErro: true
            });
        }

    }
    render() {
        if (this.state.callbackSuccess) {
            return <Redirect to="/auth" />
        }
        else if (this.state.loadError) {
            return <Redirect to="/error" />
        }
        else {
            return (
                <Page title="Loading">
                    <p>Please wait...</p>
                </Page>
            )
        }
    }
}

export default Callback