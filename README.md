# Grubdash Project

This repo was made using Express, and is an API for an online service which has two databases, Dishes and Orders.

## Dishes (/dishes)

This database contains all the available dishes for order by customers. This database is accessed through the "/dishes" or "dishes/:dishId" route.

### /dishes

On this route two methods are available, and any other methods will be denied as invalid:

GET - This will return a full list of all available dishes.
POST - When called with a body with all appropriate elements, this method will add a new dish to the list of available dishes.
> {
    id: "3c637d011d844ebab1205fef8a7e36ea",
    name: "Broccoli and beetroot stir fry",
    description: "Crunchy stir fry featuring fresh broccoli and beetroot",
    price: 15,
    image_url:
      "https://images.pexels.com/photos/4144234/pexels-photo-4144234.jpeg?h=530&w=350",
  },
  {
    id: "90c3d873684bf381dfab29034b5bba73",
    name: "Falafel and tahini bagel",
    description: "A warm bagel filled with falafel and tahini",
    price: 6,
    image_url:
      "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
  }

### /dishes/:dishId

On this route two methods are also available, and any other methods will be denied as invalid:

GET - This will return a single dish with a matching dishId, if such a dish exists.
PUT - This method, when called with a body similar to /dishes GET method, will update an existing dish. All required elements must be present in the request body, except for the dish ID, which must either match the route ID or be absent.

## Orders (/orders)

This database contains the current customer orders. This database is accessed via the "/orders" or "/orders/:orderId" route.

### /orders

This route has two available methods, and all other methods will be invalid:

GET - This will return a full list of all available orders
POST - This method, when called with a valid body, will add a new order to the orders list. The structure of the request body must match the following example.
> {
    id: "f6069a542257054114138301947672ba",
    deliverTo: "1600 Pennsylvania Avenue NW, Washington, DC 20500",
    mobileNumber: "(202) 456-1111",
    status: "out-for-delivery",
    dishes: [
      {
        id: "90c3d873684bf381dfab29034b5bba73",
        name: "Falafel and tahini bagel",
        description: "A warm bagel filled with falafel and tahini",
        image_url:
          "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
        price: 6,
        quantity: 1,
      },
    ],
  }

### /orders/:orderId

This route has 3 available methods, and all others will be denied as invalid:

GET - This method will fetch an order with a matching ID, if one exists.
PUT - This method will update an existing order. The structure must, again, match the structure shown for the POST method in "/orders", with the exception of the ID having to match the route ID, or be ommitted.
DELETE - This method will delete an order with a matching ID to the request. Only orders with the status property set to "pending" may be deleted in this way.
