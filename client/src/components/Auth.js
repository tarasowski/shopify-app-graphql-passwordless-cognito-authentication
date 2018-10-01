import React, { Component } from 'react'
import { Page, Button, ButtonGroup } from '@shopify/polaris'
import gql from "graphql-tag";
import { Query } from "react-apollo";

const QUERY = gql`{ get }`

class Authenticate extends Component {
    render() {
        return (
            <Query query={QUERY}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    console.log(data)
                    return (
                        <Page
                            title="Add New Product"
                            primaryAction={{ content: 'Save', disabled: true }}
                            secondaryActions={[{ content: 'Duplicate' }, { content: 'View on your store' }]}
                        >
                            <ButtonGroup>
                                <Button icon="add" primary={false} size="large" outline={false}>Add product</Button>
                                <Button icon="add" primary={false} size="large" outline={false}>Add product</Button>
                                <Button icon="add" primary={false} size="large" outline={false}>Add product</Button>
                                <Button icon="add" primary={false} size="large" outline={false}>Add product</Button>
                            </ButtonGroup>
                        </Page>
                    )
                }}
            </Query>
        )
    }
}

export default Authenticate;