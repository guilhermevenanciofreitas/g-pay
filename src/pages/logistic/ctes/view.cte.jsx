import React from "react";
import { Button, CheckTree, DatePicker, Form, Input, InputGroup, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, PhotoPicker, ViewModal } from "../../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import _ from "lodash";
import { Search } from "../../../search";

class ViewCte extends React.Component {

    viewModal = React.createRef()

    newStatement = async (bankAccount) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...bankAccount})
        return this.viewModal.current.show()
    }

    editCte = async (id) => {
        Loading.Show();
        await new Service().Post('logistic/cte/detail', {id}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide());
        return this.viewModal.current.show()
    }

    submit = async () => {
        this.setState({submting: true}, async () => {

            const cte = _.pick(this.state, [
                'id',
                'taker.id',
                'recipient.id',
                'origin.id',
                'destiny.id'
            ])

            await new Service().Post('logistic/cte/submit', cte).then(async (result) => {
                await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
                this.viewModal.current?.close(result.data)
            }).finally(() => this.setState({submting: false}));
        })
    }

    close(role) {
        this.viewModal.current?.close(role)
    }

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.submit}>
                <ViewModal ref={this.viewModal} size={820}>
                    <Modal.Header><Modal.Title><Container>Conhecimento</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={3}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.nCT} onChange={(event) => this.setState({nCT: event.target.value})} />
                                        <span>Número</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.serieCT} onChange={(event) => this.setState({serieCT: event.target.value})} />
                                        <span>Série</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={7}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.chaveCt} onChange={(event) => this.setState({chaveCt: event.target.value})} />
                                        <span>Chave de acesso</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='form-control'>
                                    <AutoComplete label='Tomador' value={this.state?.taker} text={(item) => item.name} onChange={(taker) => this.setState({taker})} onSearch={async (search) => await Search.recipient(search)}>
                                        <AutoComplete.Result>
                                                {(item) => <span>{item.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='form-control'>
                                    <AutoComplete label='Destinatário' value={this.state?.recipient} text={(item) => item.name} onChange={(recipient) => this.setState({recipient})} onSearch={async (search) => await Search.recipient(search)}>
                                        <AutoComplete.Result>
                                                {(item) => <span>{item.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <AutoComplete label='Origem' value={this.state?.origin} text={(item) => item.name} onChange={(origin) => this.setState({origin})} onSearch={async (search) => await Search.city(search)}>
                                        <AutoComplete.Result>
                                                {(item) => <span>{item.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <AutoComplete label='Destino' value={this.state?.destiny} text={(item) => item.name} onChange={(destiny) => this.setState({destiny})} onSearch={async (search) => await Search.city(search)}>
                                        <AutoComplete.Result>
                                                {(item) => <span>{item.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                        </Row>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Salvando...</> : <><MdCheckCircleOutline /> &nbsp; Salvar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
        )

    }

}

export default ViewCte;