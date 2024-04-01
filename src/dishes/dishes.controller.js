const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// middleware functions

function checkExists(req, res, next) {
  const dishId = req.params.dishId;
  const dish = dishes.find((dish) => dish.id === dishId);

  if (dish) {
    res.locals.dish = dish;
    next();
  } else {
    next({
      status: 404,
      message: `${dishId}`,
    });
  }
}

function checkPrice(req, res, next) {
  const { data: { price } = {} } = req.body;

  if (price) {
    if (typeof price === "number" && price > 0) {
      res.locals.newDish = req.body.data;
      next();
    } else {
      next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0",
      });
    }
  } else {
    next({
      status: 400,
      message: "price",
    });
  }
}

function checkProperty(property) {
  return function (req, res, next) {
    const data = req.body.data;

    if (data[property]) {
      next();
    }
    next({ status: 400, message: `Must include a ${property}` });
  };
}

function matchId(req, res, next) {
  const { dishId } = req.params;
  const dish = req.body.data;

  if (dish.id) {
    if (dish.id === dishId) {
      res.locals.newDish = dish;
      next();
    } else {
      next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${dish.id} Route: ${dishId}`,
      });
    }
  } else {
    dish.id = dishId;
    res.locals.newdish = dish;
    next();
  }
}

// end of middleware functions

// controller functions

function create(req, res) {
  const newDish = res.locals.newDish;
  newDish.id = nextId();
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function list(req, res) {
  //   const dishId = Number(req.params.dishId);
  res.status(200).json({
    data: dishes,
  });
}

function read(req, res) {
  res.status(200).json({ data: res.locals.dish });
}

function update(req, res) {
  const index = dishes.findIndex((dish) => dish.id === res.locals.dish.id);
  dishes[index] = { ...res.locals.newDish };
  res.status(200).json({ data: dishes[index] });
}

// end of controller functions

module.exports = {
  create: [
    checkProperty("name"),
    checkProperty("description"),
    checkProperty("image_url"),
    checkPrice,
    create,
  ],
  list,
  read: [checkExists, read],
  update: [
    checkExists,
    matchId,
    checkProperty("name"),
    checkProperty("description"),
    checkProperty("image_url"),
    checkPrice,
    update,
  ],
};
