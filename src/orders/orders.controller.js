const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// middleware functions

function checkExists(req, res, next) {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    res.locals.orderId = orderId;
    res.locals.order = order;
    next();
  } else {
    next({
      status: 404,
      message: `Cannot find order id: ${orderId}`,
    });
  }
}

function checkMatch(req, res, next) {
  const { orderId } = req.params;
  const order = req.body.data;

  console.log(order);

  if (order.id) {
    if (order.id === orderId) {
      res.locals.newOrder = order;
      next();
    } else {
      next({
        status: 400,
        message: `Route id (${orderId}) and Order id (${order.id}) do not match.`,
      });
    }
  } else {
    order.id = orderId;
    res.locals.newOrder = order;
    console.log(res.locals.newOrder);
    next();
  }
}

function checkProperty(property) {
  return function (req, res, next) {
    const data = req.body.data;

    if (data[property]) {
      next();
    } else {
      next({ status: 400, message: `Must include a ${property}` });
    }
  };
}

function checkQuantity(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  const check = dishes.every(
    (dish) => typeof dish.quantity === "number" && dish.quantity > 0
  );

  if (check) {
    res.locals.dish = req.body.data;
    next();
  } else {
    const index = dishes.findIndex(
      (dish) => typeof dish.quantity !== "number" || dish.quantity <= 0
    );
    next({
      status: 400,
      message: `dish ${index} must have a quantity that is an integer greater than 0`,
    });
  }
}

function checkStatus(req, res, next) {
  const order = orders.find((order) => order.id === req.params.orderId);
  const status = order.status;

  if (status === "pending") {
    next();
  } else {
    next({
      status: 400,
      message: "Only pending messages may be canceled",
    });
  }
}

function validateDishes(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  const dishesType = typeof dishes;

  if (dishesType === "object") {
    const length = dishes.length;
    if (length) {
      next();
    } else {
      next({
        status: 400,
        message: "Order must include at least one dish",
      });
    }
  } else {
    next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
}

function validateStatus(req, res, next) {
  const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];
  const status = req.body.data.status;

  if (validStatus.includes(status)) {
    next();
  } else {
    next({
      status: 400,
      message: "Invalid status.",
    });
  }
}

// end of middleware functions

// controller functions

function create(req, res) {
  res.locals.dish.id = nextId();
  orders.push(res.locals.dish);
  res.status(201).json({
    data: res.locals.dish,
  });
}

function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  const deletedOrder = orders.splice(index, 1);
  res.status(204).json({ data: deletedOrder });
}

function list(req, res) {
  res.status(200).json({
    data: orders,
  });
}

function read(req, res) {
  res.status(200).json({
    data: res.locals.order,
  });
}

function update(req, res) {
  const newOrder = res.locals.newOrder;
  const index = orders.findIndex((order) => order.id === newOrder.id);
  console.log(newOrder);
  orders[index] = newOrder;
  res.status(200).json({ data: newOrder });
}

// end of controller functions

module.exports = {
  create: [
    checkProperty("deliverTo"),
    checkProperty("mobileNumber"),
    checkProperty("dishes"),
    validateDishes,
    checkQuantity,
    create,
  ],
  delete: [checkExists, checkStatus, destroy],
  list,
  read: [checkExists, read],
  update: [
    checkExists,
    checkMatch,
    checkProperty("deliverTo"),
    checkProperty("mobileNumber"),
    checkProperty("dishes"),
    checkProperty("status"),
    validateStatus,
    validateDishes,
    checkQuantity,
    update,
  ],
};
