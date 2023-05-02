# UKIT 2

The UKIT v2.0.0-pre.2.1 version is under devlop.

## What's new

- Use stream to transfer a common file when it is big enough. \[Devlopping\] \[Now avaliable\]
- Multiple CPU Support (Multiprocess) \[Devlopping\] \[Now avaliable\]
- POST method supported \[Waiting\]
- In-time interactive framework(IT2A) \[Waiting\]
- Message Stream - communicating with clients real-time \[Waiting\]

### Stream transmission

Use stream to transfer a common file when it is big enough.

### POST method

create .post.ukit file to process POST content.

A completely new file type, it can be used not only on the browser.

### IT2A

In-time Interactive Framework.  
Client can call a function on server side. Server side function can access client side data.

### Message Stream

Server side functions can communicate with client side functions when Message Stream is enabled.

It can also be used to transfer large file



# UKITWeb

UKITWeb is a framework which helps you building your website.

## How to use it

*We advise you to create an empty folder to start your project.*

You need these files

| File name | usage |
| :---: | :--- |
| node | In order to run a nodejs program you need a runtime enviroment first. |
| UKITMain.node.js | This is UKITWeb Framework's main program. |
| port.conf | This file contians the port which you want the server to listen. |
| ukitforground.js | This is an framework code file, it is used to load data for the browser. |
| index.upage | This is a file which will be written by your self. It is the main page. (Isn't a must) |
| other files | Add what you need |

Notice: **Only files which end by the ".upage" subfix will be translated by the framework, the others will be send to the browser directly**

address-bind.conf: set the file-head to "# disable" to disable ip-binding. The second line should be ip-addr, use ',' between two address to split them.


### About the UPage file

A UPage file must be end by the subfix ".upage"

It must contains the lable `<upageCode>` and it must be end by `</upageCode>`

In the upageCode element, you need to create a function called "onGet" with an argument. (In this document, I named it "framework")
framework has 2 method `getArg` and `export`
`framework.getArg(name)` is used to get url arguments
`framework.export(key, value)` is used to export a value

In scripts in HTML, you can use `framework.read(key)` to get the value which you have exported.




Notice: **If a UPage file didn't have the upageCode label, it will be never returned. It means that users will see thier browser is loading endlessly.**

Note: *If you want to creat a static file which dosen't need upage part, you can create it with the subfix ".html"*

