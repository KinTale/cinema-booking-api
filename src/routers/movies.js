const express = require('express')
const router = express.Router()
const {getMovies, createMovie, getMovie, updateMovie, createScreen} = require('../controllers/movies')


router.get('/', getMovies)
router.post('/movie',createMovie)
router.get('/:search', getMovie )
router.patch('/update/:id/:screenings', updateMovie)
router.post('/screen', createScreen)

module.exports = router