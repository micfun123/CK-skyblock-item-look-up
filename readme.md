
# CubeKrowed Skyblock - Unofficial Item Lookup Site

  

CubeKrowed Skyblock is an unofficial item lookup site for the CubeKrowd server, designed to help players find information about items, trades, and sells on various islands.

  

## Contributing


If you would like to contribute to the CubeKrowed Skyblock project, follow these steps:

 - Fork the repository.
  - Edit the `islandsData.json` file with your or a know islands trade
  - Make a pull request
  - I will verify it and accept the pull request

### Example Island

```json
"islandname": {
        "publicItems": [ "Carrots", "potatoes" ], //free items
        "trades": [
            {
                "villager_name": "Farmer",
                "give": "Carrots", //what you give the viliger
                "get": "potatoes", //what does the player get
                "receiveamount": 1, //how much does the player get
                "giveamount": 5  //how much does the player give
            },
            {
                "villager_name": "bob",  //second trade
                "give": "potatoes",
                "get": "Carrots",
                "receiveamount": 1,
                "giveamount": 5
            }
        ],
        "sell": [
            {
                "item": "Carrots", //what the island owner gets
                "itemrecieve": "potatoes", //what the player gets
                "price": 1 //how much does the island owner charge

            },
            {
                "item": "potatoes",
                "itemrecieve": "Carrots",
                "price": 1

            }
        ]
  },

```

## Acknowledgments
Special thanks to the CubeKrowed community.



#
[CK Skyblock item look up](https://ckskyblock.michaelparker.tech/)
#
[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/Michaelrbparker)



## todo

    * Search by is name
    * before any search is done show newly added stuffs