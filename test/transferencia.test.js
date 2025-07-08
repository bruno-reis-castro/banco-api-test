const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()
const { obterToken } = require('../helpers/autenticacao')
const postTransferencia = require ('../fixtures/postTransferencia.json')


describe('Trasnferencias', () => {
    let token

    beforeEach(async () => {
        token = await obterToken('julio.lima','123456')
    })
    
    describe('POST/transferencias', () => {


        it('Deve retornar sucesso com 201 quando o valor da transferencia for igual ou acima de 10 reais', async () =>{
            //captura token
            
            const bodyTransferencia = { ...postTransferencia }
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type','application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencia)
            expect(resposta.status).to.equal(201)
            console.log(resposta.body)            
        })

        it('Deve retornar sucesso com 422 quando o valor da transferencia for abaixo de 10 reais', async () =>{           
            const bodyTransferencia = { ...postTransferencia }
            bodyTransferencia.valor = 1
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type','application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencia)
            expect(resposta.status).to.equal(422)
            console.log(resposta.body)           
        })
    })

    describe('GET /transferencias/{id}', () => {
        it('Deve retornar sucesso com 200 dados iguais aos registros de transf contidos no banco de dados quando o ID for válido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias/16')
                .set('Authorization', `Bearer ${token}`)
            expect(resposta.status).to.equal(200)
            expect(resposta.body.id).to.equal(16)  
            expect(resposta.body.id).to.be.a('number') 
            expect(resposta.body.conta_origem_id).to.equal(1)  
            //console.log(resposta.body)
            //console.log(resposta.status)

        })
    
    
    
    })
    describe('GET /transferencias', () => {
        it('Deve retornar 10 elementos na paginação quando informar limite de 10 registros', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)
            expect(resposta.status).to.equal(200)
            expect(resposta.body.limit).to.equal(10)
            expect(resposta.body.transferencias).to.have.lengthOf(10)
            //console.log(resposta.body)
            //console.log(resposta.status)

        })
    
    
    
    })
})