const prisma = require('../utils/prisma')


const getMovie = async (req, res) => {
  const search = req.params.search
  const id = parseInt(search)

  if (id) {
    const findMovie = await prisma.movie.findFirst({
      where: {
        id: id
      }
    })
    if (!findMovie) {
      res.status(404)
      res.json({ error: 'Movie doesnt not exist' })
      return
    } else { res.json({ movie: findMovie }) }
  }

  if (!id) {
    const findMovie = await prisma.movie.findFirst({
      where: {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      }
    })
    if (!findMovie) {
      res.status(404)
      res.json({ error: 'Movie doesnt not exist' })
      return
    } else { res.json({ movie: findMovie }) }
  }
}

const getMovies = async (req, res) => {

  const filters = {
    runtimeMins: {}
  }

  if (req.query.runtimeGreater) {
    filters.runtimeMins.gt = parseInt(req.query.runtimeGreater)
  }
  if (req.query.runtimeLess) {
    filters.runtimeMins.lt = parseInt(req.query.runtimeLess)
  }
  const movies = await prisma.movie.findMany({
    where: filters,
    include: {
      screenings: true
    }
  })

  if (movies.length === 0) {
    res.status(404)
    res.json({ error: "movie does not exist" })
    return
  }

  res.json({ movies: movies })
}

const createMovie = async (req, res) => {
  const { title, runtimeMins } = req.body

  const existingMovies = await prisma.movie.findMany({
    where: {
      title: title,
    }
  })

  if (existingMovies.length > 0) {
    res.status(400)
    res.json({ 'error': 'movie exists with title' })
    return
  }

  const movieData = {
    data: {
      title: title,
      runtimeMins: runtimeMins
    }
  }

  if (req.body.screenings) {

    const screeningsToCreate = []

    for (const requestScreening of req.body.screenings) {
      screeningsToCreate.push({
        startsAt: new Date(Date.parse(requestScreening.startsAt)),
        screenId: requestScreening.screenId
      })
    }
    movieData.data.screenings = {
      create: screeningsToCreate
    }
  }

  const createdMovie = await prisma.movie.create(movieData)

  res.json({ data: createdMovie })
}

const updateMovie = async (req, res) => {
  const movieId = parseInt(req.params.id)
  const screeningId = parseInt(req.params.screenings)

  const screenId = req.body.screenings.map(x => x.screenId)
  const startsAt = req.body.screenings.map(x => x.startsAt)
  const movie = await prisma.movie.update({
    where: { id: movieId },
    data: {
      title: req.body.title,
      runtimeMins: req.body.runtimeMins,
      screenings: {
        update: {
          where: { id: screeningId },
          data: {
            startsAt: new Date(Date.parse(startsAt)),
            screenId: parseInt(screenId)
          }
        }
      }
    }, include: {
      screenings: true
    }
  })

  res.json({ movie: movie })


}

const createScreen = async (req, res) => {

  const screenNumber = parseInt(req.body.number)
  const newScreen = await prisma.screen.create({
    data: {
      number: screenNumber
    }
  })
  res.json({ screen: newScreen })
}



module.exports = { getMovies, createMovie, getMovie, updateMovie, createScreen }

