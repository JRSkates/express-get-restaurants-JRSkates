const { Router } = require('express');
const router = Router();
const Restaurant = require("../../models/index")

router.get("/", async (req, res) => {
    const restaurants = await Restaurant.findAll()
    res.json(restaurants)
})
router.get('/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    res.json(restaurant)
})

router.post('/', async (req, res) => {
    const newRestaurant = await Restaurant.create(req.body)
    res.json(newRestaurant)
})

router.put('/:id', async (req, res) => {
    const updatedRestaurant = await Restaurant.update(req.body, {
        where: { id: req.params.id }
    })
    res.json(updatedRestaurant)
})

router.delete('/:id', async (req, res) => {
    const deletedRestaurant = await Restaurant.destroy({
        where: { id: req.params.id }
    })
    res.json(deletedRestaurant)
})


module.exports = router;