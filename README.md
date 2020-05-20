# Orders API

## Response structure

The structure of the API responses' body is as follows:

-   for successful responses, a JSON object containing the properties:
    -   `success`: `true`
    -   `data`: An object, structure detailed for each route below.
-   for unsuccessful responses, a JSON object containing the
    properties:
    -   `success`: `false`
    -   `error`: An object containing a `message` property, and
        sometimes additional helpful properties.
	
## /api/v1/orders

### GET

Get the all the orders from the db.

**Return codes**:

-   200 - OK
-   400 - There was a problem fetching data

**Usage example**:  
 `localhost:3000/api/v1/orders`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "orders": [
            {
                "paymentMethod": "cash",
                "guest": true,
                "_id": "5ead4f803f29fe06b727b88a",
                "email": "andu.birnoveanu@gmail.com",
                "userFirstName": "Andu",
                "userLastName": "Birnoveanu",
                "phoneNumber": "0745520036",
                "restaurantId": "5e9494aadd757435187a6dbd",
                "userDeliveryAdress": "Bld. Alex. cel Bun 47",
                "orderDate": "2020-05-02T13:46:24.102Z",
                "items": [
                    {
                        "item": {
                            "price": 20,
                            "quantity": 1,
                            "product": "Pizza"
                        },
                        "_id": "5ead4f803f29fe06b727b88b",
                        "id": "5e9494d0dd757435187a6dc0"
                    }
                ],
                "amount": 20,
                "__v": 0
            },
            {
                "paymentMethod": "cash",
                "guest": true,
                "_id": "5ead519d3f29fe06b727b892",
                "email": "paul.cojocaru@gmail.com",
                "userFirstName": "Paul",
                "userLastName": "Cojocaru",
                "phoneNumber": "0788654321",
                "restaurantId": "5e9494aadd757435187a6dbd",
                "userDeliveryAdress": "Str. Primaverii 35",
                "orderDate": "2020-05-02T13:55:25.047Z",
                "items": [
                    {
                        "item": {
                            "price": 20,
                            "quantity": 3,
                            "product": "Pizza"
                        },
                        "_id": "5ead519d3f29fe06b727b893",
                        "id": "5e9494d0dd757435187a6dc0"
                    }
                ],
                "amount": 60,
                "__v": 0
            },
            {
                "paymentMethod": "card",
                "guest": false,
                "_id": "5ead6a3020197a0a76be6eb5",
                "userId": "5e8c4f351842ba322c5c13ec",
                "email": "toma.manolescu@gmail.com",
                "userFirstName": "Toma",
                "userLastName": "Manolescu",
                "phoneNumber": "0723570389",
                "restaurantId": "5e9494aadd757435187a6dbd",
                "userDeliveryAdress": "Str. 1 Decembrie 40",
                "orderDate": "2020-05-02T15:40:16.200Z",
                "items": [
                    {
                        "item": {
                            "price": 20,
                            "quantity": 2,
                            "product": "Pizza"
                        },
                        "_id": "5ead6a1020197a0a76be6eb4",
                        "id": "5e9494d0dd757435187a6dc0"
                    }
                ],
                "amount": 40,
                "__v": 0
            }
        ]
    }
}
```

## /api/v1/orders/:orderId

### GET

Get a specific order by its id.

**Return codes**:

-   200 - OK
-   400 - There was a problem fetching data

**Usage example**:  
 `localhost:3000/api/v1/orders/5ead4f803f29fe06b727b88a`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "orders": [
            {
                "paymentMethod": "cash",
                "guest": true,
                "_id": "5ead4f803f29fe06b727b88a",
                "email": "andu.birnoveanu@gmail.com",
                "userFirstName": "Andu",
                "userLastName": "Birnoveanu",
                "phoneNumber": "0745520036",
                "restaurantId": "5e9494aadd757435187a6dbd",
                "userDeliveryAdress": "Bld. Alex. cel Bun 47",
                "orderDate": "2020-05-02T13:46:24.102Z",
                "items": [
                    {
                        "item": {
                            "price": 20,
                            "quantity": 1,
                            "product": "Pizza"
                        },
                        "_id": "5ead4f803f29fe06b727b88b",
                        "id": "5e9494d0dd757435187a6dc0"
                    }
                ],
                "amount": 20,
                "__v": 0
            }
        ]
    }
}
```
## /api/v1/orders

### POST

Post a order to Order Database

**Body example**

`userId`, `userDeliveryAdress` sunt optionale.

```JSON
{
	"userId": "5e8c4f351842ba322c5c13ec",
	"email": "test@yahoo.com",
    "userFirstName": "Test",
    "userLastName": "Test",
    "phoneNumber": "2341341227",
    "restaurantId": "5eb16d673a637d28884dc226",
    "paymentMethod": "cash",
    "userDeliveryAdress": "Str. Palat 10"
}
```

**Return codes**:

-   201 - CREATED
-   400 - Bad Request

**Usage example**:  
 `localhost:3000/api/v1/orders`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "order": {
            "paymentMethod": "cash",
            "guest": false,
            "_id": "5eb29ba3bae6850104c29940",
            "userId": "5e8c4f351842ba322c5c13ec",
            "email": "test@yahoo.com",
            "userFirstName": "Test",
            "userLastName": "Test",
            "phoneNumber": "2341341227",
            "restaurantId": "5eb16d673a637d28884dc226",
            "userDeliveryAdress": "Str. Palat 10",
            "orderDate": "2020-05-06T14:12:35.958Z",
            "items": [
                {
                    "_id": "5eb298f4bae6850104c2993f",
                    "item": {
                        "price": 20,
                        "quantity": 4,
                        "product": "Pizza"
                    },
                    "id": "5eb173d3d6fb9132c43218a2"
                }
            ],
            "amount": 80,
            "__v": 0
        }
    }
}
```

## /api/v1/cart/session

### GET

Get the whole session cart .

**Return codes**:

-   200 - OK
-   400 - There was a problem fetching data

**Usage example**:  
 `localhost:3000/api/v1/cart/session`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "5eb173d3d6fb9132c43218a2",
                "item": {
                    "price": 20,
                    "quantity": 5,
                    "product": "Pizza"
                }
            }
        ],
        "totalPrice": 100,
        "totalQty": 5
    }
}
```

## /api/v1/cart

### POST

Post a session cart to Cart Database for an user.

**Body example**

```JSON
{
    "userId": "5e8c4f351842ba322c5c13ec",
}
```

**Return codes**:

-   201 - CREATED
-   400 - Bad Request

**Usage example**:  
 `localhost:3000/api/v1/cart`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "cartObj": {
            "_id": "5eb29521bae6850104c2993d",
            "userId": "5e8c4f351842ba322c5c13ec",
            "modifiedDate": "2020-05-06T13:44:49.816Z",
            "items": [
                {
                    "_id": "5eb29521bae6850104c2993e",
                    "id": "5eb173d3d6fb9132c43218a2",
                    "item": {
                        "price": 20,
                        "quantity": 2,
                        "product": "Pizza"
                    }
                }
            ],
            "totalPrice": 40,
            "totalQuantity": 2,
            "__v": 0
        }
    }
}
```

## /api/v1/cart/:userId

### PATCH

Modifies a cart from Cart Database with the sseion cart for a userId.

**Return codes**:

-   202 - Accepted
-   400 - Bad Request

**Usage example**:  
 `localhost:3000/api/v1/cart/5e8c4f351842ba322c5c13ec`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "cartObj": {
            "n": 1,
            "nModified": 1,
            "opTime": {
                "ts": "6823684559159164930",
                "t": 50
            },
            "electionId": "7fffffff0000000000000032",
            "ok": 1,
            "$clusterTime": {
                "clusterTime": "6823684559159164930",
                "signature": {
                    "hash": "XioMWLlIfNGiqaIT0hKyovVm+mE=",
                    "keyId": "6759538930535628801"
                }
            },
            "operationTime": "6823684559159164930"
        }
    }
}
```

## /api/v1/cart/:userId

### GET

Get a specific cart by its userId.

**Return codes**:

-   200 - OK
-   400 - There was a problem fetching data

**Usage example**:  
 `localhost:3000/api/v1/cart/5e8c4f351842ba322c5c13ec`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "cart": [
            {
                "_id": "5eb29521bae6850104c2993d",
                "userId": "5e8c4f351842ba322c5c13ec",
                "modifiedDate": "2020-05-06T13:44:49.816Z",
                "items": [
                    {
                        "item": {
                            "price": 20,
                            "quantity": 2,
                            "product": "Pizza"
                        },
                        "_id": "5eb29521bae6850104c2993e",
                        "id": "5eb173d3d6fb9132c43218a2"
                    }
                ],
                "totalPrice": 40,
                "totalQuantity": 2,
                "__v": 0
            }
        ]
    }
}
```

## /api/v1/cart/add-product/:idProduct

### GET

Add a product into a cart session by its id.

**Return codes**:

-   200 - OK
-   400 - Bad request

**Usage example**:  
 `localhost:3000/api/v1/cart/add-product/5eb173d3d6fb9132c43218a2`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "cart": {
            "items": [
                {
                    "id": "5eb173d3d6fb9132c43218a2",
                    "item": {
                        "price": 20,
                        "quantity": 1,
                        "product": "Pizza"
                    }
                }
            ],
            "totalPrice": 20,
            "totalQty": 1
        }
    }
}
```

## /api/v1/cart/add-quantity/:idProduct

### GET

Add quantity to a product from the cart session by its id.

**Return codes**:

-   200 - OK
-   400 - Bad request

**Usage example**:  
 `localhost:3000/api/v1/cart/add-quantity/5eb173d3d6fb9132c43218a2`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "cart": {
            "items": [
                {
                    "id": "5eb173d3d6fb9132c43218a2",
                    "item": {
                        "price": 20,
                        "quantity": 2,
                        "product": "Pizza"
                    }
                }
            ],
            "totalPrice": 40,
            "totalQty": 2
        }
    }
}
```

## /api/v1/cart/substract-quantity/:idProduct

### GET

Substract quantity from a product from the cart session by its id.

**Return codes**:

-   200 - OK
-   400 - Bad request

**Usage example**:  
 `localhost:3000/api/v1/cart/substract-quantity/5eb173d3d6fb9132c43218a2`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "cart": {
            "items": [
                {
                    "id": "5eb173d3d6fb9132c43218a2",
                    "item": {
                        "price": 20,
                        "quantity": 1,
                        "product": "Pizza"
                    }
                }
            ],
            "totalPrice": 20,
            "totalQty": 1
        }
    }
}
```

## /api/v1/cart/delete-product/:idProduct

### GET

Delete a product from the cart session by its id.

**Return codes**:

-   200 - OK
-   400 - Bad request

**Usage example**:  
 `localhost:3000/api/v1/cart/delete-product/5eb173d3d6fb9132c43218a2`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "cart": {
            "items": [],
            "totalPrice": 0,
            "totalQty": 0
        }
    }
}
```

## /api/v1/cart/clear

### GET

Delete the session cart.

**Return codes**:

-   200 - OK
-   400 - There was a problem fetching data

**Usage example**:  
 `localhost:3000/api/v1/cart/clear`

**Returned data example**:

```JSON
{
    "success": true,
    "data": "Cart cleared"
}
```