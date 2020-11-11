import Supertest from 'supertest'
import Chai from 'chai'
import app from '../../src/app'

global.app = app
global.request = Supertest(app)
global.expect = Chai.expect