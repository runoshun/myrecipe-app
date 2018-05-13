export default {
    "definitions": {
        "EntitiesState": {
            "properties": {
                "meelPreps": {
                    "$ref": "#/definitions/EntityState<MeelPrepEntity>"
                },
                "meels": {
                    "$ref": "#/definitions/EntityState<MeelEntity>"
                },
                "recipes": {
                    "$ref": "#/definitions/EntityState<RecipeEntity>"
                },
                "shoppingList": {
                    "$ref": "#/definitions/EntityState<ShoppingListItemEntity>"
                }
            },
            "required": [
                "meelPreps",
                "meels",
                "recipes",
                "shoppingList"
            ],
            "type": "object"
        },
        "Entity": {
            "properties": {
                "id": {
                    "type": "string"
                }
            },
            "required": [
                "id"
            ],
            "type": "object"
        },
        "EntityState<MeelEntity>": {
            "additionalProperties": {
                "$ref": "#/definitions/Entity"
            },
            "type": "object"
        },
        "EntityState<MeelPrepEntity>": {
            "additionalProperties": {
                "$ref": "#/definitions/Entity"
            },
            "type": "object"
        },
        "EntityState<RecipeEntity>": {
            "additionalProperties": {
                "$ref": "#/definitions/Entity"
            },
            "type": "object"
        },
        "EntityState<ShoppingListItemEntity>": {
            "additionalProperties": {
                "$ref": "#/definitions/Entity"
            },
            "type": "object"
        }
    },
    "properties": {
        "future": {
            "items": {
                "$ref": "#/definitions/EntitiesState"
            },
            "type": "array"
        },
        "past": {
            "items": {
                "$ref": "#/definitions/EntitiesState"
            },
            "type": "array"
        },
        "present": {
            "$ref": "#/definitions/EntitiesState"
        }
    },
    "required": [
        "future",
        "past",
        "present"
    ],
    "type": "object"
}
