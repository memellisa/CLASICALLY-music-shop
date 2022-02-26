// const pug = require('pug');

// const { populate } = require("../../models/music.model");

// const session = require("express-session");

// DOM Ready ============================================================= 
$(document).ready(function () {
});
// Functions ============================================================= 

$(window).on('load', function() {
    if (window.location.pathname == "/redirect/invalid-login") {
        setTimeout(function(){ window.location.href = "/login" }, 3000); 
    } 
    else if (window.location.pathname == "/redirect/account-existed") {
        setTimeout(function(){ window.location.href = "/create" }, 3000); 
    } 
    else if (window.location.pathname == "/redirect/logout") {
        setTimeout(function(){ window.location.href = "/" }, 3000); 
    } 
    else if (window.location.pathname == "/redirect/account-created") {
        setTimeout(function(){ window.location.href = "/login" }, 3000); 
    } 
    else if (window.location.pathname == "/invoice" ) {
        // console.log("WINDOW STORAGE TOTAL")
        // console.log(JSON.parse(window.localStorage.getItem('windowStorage')))
        if (window.localStorage.getItem('windowStorage')){
            for (let x of JSON.parse(window.localStorage.getItem('windowStorage')).cart) {
                $( "#cart-list-invoice" ).append( `
                <div>
                    <span> ${ x.quantity }x </span>
                    <span> ${ x.name }  &nbsp </span>
                    <span> HK$ ${ x.price } </span>
                </div>` );
            }
            
            $('#total-price-invoice').html(JSON.parse(window.localStorage.getItem('windowStorage')).total);
            window.localStorage.removeItem('windowStorage');
        }
        
    } 
    else if (window.location.pathname == "/"){
        if (window.localStorage.getItem('keyword') !== null){
            const keywords = window.localStorage.getItem('keyword').split(',');
            const result = [];
            const categories = [];
            fetch('/data').
            then(response => {
                if (response.status==200) {
                    response.json().then(
                        data => {
                            for (let music of data.data){
                                if (!categories.includes(music.category)){
                                    categories.push(music.category);
                                }
                                for(let keyword of keywords){
                                    if (music.name.includes(keyword) || music.composer.includes(keyword)){
                                        result.push(music);
                                    }
                                }
                            }
                            populateCategory(categories)
                            populateResults(result);

                        }
                    )
                }
            })
            window.localStorage.removeItem('keyword');
        } else {
            fetch('/');
        }
        

    }
    $.ajax({
        type: 'GET',
        url: '/cart/all',
        }).done(function (response) {
            let quantity = 0;
            console.log(response);
            for (x in response) {
                quantity += response[x].quantity
                console.log(x);
            }
        console.log(quantity);
        $('#num-of-items').html(function() {
            return quantity;
          });
    })

});

$('#submitBtn').on('click', verifyUser);
function verifyUser(event) {
    event.preventDefault();
    var errorCount = 0;
    if ($('#cred-form input#username').val() !== '' && $('#cred-form input#password').val() !== '') {
        var username = $('#cred-form input#username').val();
        console.log('username: ', username);
        var password = $('#cred-form input#password').val();
        var user = {
            'username': username,
            'password': password,
        } 
        console.log(user)
        
        $.ajax({
            type: 'POST',
            data: user,
            url: '/login',
            dataType: 'JSON'
            }).done(function (response) {
                console.log(response)
                if (response.msg === '') {
                    if (response.sessionCarts) {
                        for (x in response.sessionCarts) {
                            $.ajax({
                                type: 'POST',
                                data: response.sessionCarts[x],
                                url: '/cart/addToCart',
                                dataType: 'JSON'
                                }).done(function (response) {
                                    console.log("hello")
                                });
                        }
                        window.location.href = "/";
                        
                    }
                    else {
                        window.location.href = "/";
                    }
                } else {

                    $.ajax({
                        type: 'GET',
                        url: '/redirect/invalid-login',
                        }).done(function (response) {
                            console.log(response)
                            window.location.href = "/redirect/invalid-login";
                            // setTimeout(function(){ window.location.href = "/login" }, 3000);    
                    })
                }
            });
    } else {
        console.log("empty")
        alert('Please do not leave the fields empty')
        return false;
    } 
};


$('#confirmBtn').on('click', createAccount);
function createAccount(event) {
    event.preventDefault();
    if ($('#cred-form input#username').val() !== '' && $('#cred-form input#password').val() !== '') {
        var username = $('#cred-form input#username').val();
        console.log('username: ', username);
        var password = $('#cred-form input#password').val();
        var user = {
            'username': username,
            'password': password,
        } 
        console.log(user)
        
        $.ajax({
            type: 'POST',
            data: user,
            url: '/create',
            dataType: 'JSON'
            }).done(function (response) {
                console.log("RESPONSE",response.msg);
                if (response.msg === '') {
                    window.location.href = "/redirect/account-created";
                } else {
                    $.ajax({
                        type: 'GET',
                        url: '/redirect/account-existed',
                        }).done(function (response) {
                            window.location.href = "/redirect/account-existed";
                    })  
                }
            });
    } else {
        alert('Please do not leave the fields empty')
        return false;
    } 
};



$('#backBtn').on('click', back);

function back(event) {
    event.preventDefault();

    window.location.href = "/login";
    //back to loginn

};

$('#createBtn').on('click', create);

function create(event) {
    event.preventDefault();
    
    setTimeout(function(){ alert('Go to create account page'); }, 3000); 
    window.location.href = "/create";
    
}

$('#signInBtn').on('click', function(event) {
    event.preventDefault();
    console.log("hello");
    window.location = "/login";
})

$('#registerBtn').on('click', function(event) {
    event.preventDefault();
    window.location = "/create";
})

$('#cartBtn').on('click', function(event) {
    event.preventDefault();
    console.log("hello");
    window.location = "/cart";
})

$('#addCartBtn').on('click', addToCart);
function addToCart(event) {
    event.preventDefault();
    
    if ($('#order-form input#order').val() !== '') {
        var quantity = $('#order-form input#order').val();

        cart = {
            "musicId": event.target.attributes.name.nodeValue,
            "musicName": $('#musicName').html(),
            "musicPrice": $('#price').attr("name"),
            'username': "",
            'quantity': quantity,
        }
        
        $.ajax({
            type: 'POST',
            data: cart,
            url: '/cart/addToCart',
            dataType: 'JSON'
            }).done(function (response) {
                if (response.msg == "") {
                    // console.log("ada user and success")
                    window.location.href = '/cart';
                }
                else {
                    console.log(response);
                }
            });
    
    } else {
        console.log("empty")
        alert('Please do not leave the fields empty')
        return false;
    } 
};


$('#logOutBtn').on('click', logOut);
function logOut(event) {
    event.preventDefault();
    // var message = {message: "Logging out"};
    $.ajax({
        type: 'GET',
        url: '/redirect/logout',
        }).done(function (response) {
            // console.log(response)
            window.location.href = "/redirect/logout";
            // setTimeout(function(){ window.location.href = "/" }, 3000);   
    })
};

$('#backFromCart').on('click', backFromCart);
function backFromCart(event) {
    event.preventDefault();
    window.location = '/';   
}

$('#checkoutFromCart').on('click', checkoutFromCart);
function checkoutFromCart(event) {
    event.preventDefault();
    window.location = '/checkout';   
}

// $('.deleteCart').on('click', deleteCart);
function deleteCart(event, instance) {
    console.log(instance.getAttribute('name'))
    // event.preventDefault();
    console.log("delete")
    $.ajax({
        type: 'DELETE',
        url: '/cart/delete/' + instance.getAttribute('name'),
        }).done(function (response) {
            
            fetch('/cart/data').
            then(response => {
                console.log(response)
                if (response.status==200) {
                    response.json().then(
                        data => {
                            console.log("DATA", data.data)
                            const carts = data.data;

                            populateCart(carts);
                            $.ajax({
                                type: 'GET',
                                url: '/cart/all',
                                }).done(function (response) {
                                    let quantity = 0;
                                    console.log(response);
                                    for (x in response) {
                                        quantity += response[x].quantity
                                        console.log(x);
                                    }
                                console.log(quantity);
                                $('#num-of-items').html(function() {
                                    return quantity;
                                  });
                            })
                        }
                    )
                }
            })
            // window.location.reload(); 
    })
}

$('#usernameExpress').on('blur', checkAvailability);
function checkAvailability(event) {
    $.ajax({
        type: 'GET',
        url: '/login/allUsername',
        }).done(function (response) {
            console.log(response)
            for (let x of response) {
                if (x.username === $('#usernameExpress').val()) {
                    $('#usernameExpress').val("");
                    $('#duplicatedWarning').css('display', 'inline-block');
                    return false;
                }
            }
            $('#duplicatedWarning').css('display', 'none');
        }
    );
}

// $('#checkoutForm').on('submit', checkoutSubmit);
function checkoutSubmit(event, instance) {
    event.preventDefault();
    if($('#usernameExpress').length){
        $.ajax({
            type: 'GET',
            url: '/login/allUsername',
            }).done(function (response) {
                console.log(response)
                for (let x of response) {
                    if (x.username === $('#usernameExpress').val()) {
                        $('#usernameExpress').val("");
                        $('#duplicatedWarning').css('display', 'inline-block');
                        return false;
                    }
                }

                var user = {
                    'username': $('#usernameExpress').val(),
                    'password': $('#passwordExpress').val(),
                }

                $.ajax({
                    type: 'POST',
                    data: user,
                    url: '/create',
                    dataType: 'JSON'
                    }).done(function (response) {
                        console.log("RESPONSE",response.msg);
                        if (response.msg === '') {
                            var invoiceData = {
                                'fullName': $('#fullNameCheckout').val(),
                                'companyName': $('#companyNameCheckout').val(),
                                'addressOne': $('#addressOneCheckout').val(),
                                'addressTwo': $('#addressTwoCheckout').val(),
                                'city': $('#cityCheckout').val(),
                                'region': $('#regionCheckout').val(),
                                'country': $('#countryCheckout').val(),
                                'zip': $('#zipCheckout').val(),
                                'cart': '',
                                'total': $('#checkout-total').html()
                            }
                            if (invoiceData.addressTwo == ""){
                                invoiceData.addressTwo = "NA";
                            }

                            if (invoiceData.companyName == ""){
                                invoiceData.companyName = "NA";
                            }
                            
                            if (invoiceData.region == ""){
                                invoiceData.region = "NA";
                            }

                            let tempQuantity = []
                            let tempName = []
                            let tempPrice = [];
                            
                            $(".quantity-checkout").each(function() {
                                tempQuantity.push($(this).html());
                            });

                            $(".name-checkout").each(function() {
                                tempName.push($(this).html());
                            });

                            $(".price-checkout").each(function() {
                                tempPrice.push($(this).html());
                            });

                            let tempObject = []
                            let index = 0; 
                            for (let x of tempQuantity) {
                                console.log("X VALUES")
                                console.log(x)
                                var object = {
                                    "quantity": tempQuantity[index],
                                    "name": tempName[index],
                                    "price": tempPrice[index],
                                    
                                }
                                index++;
                                tempObject.push(object);
                            }

                            invoiceData.cart = tempObject;
                            window.localStorage.setItem('windowStorage', JSON.stringify(invoiceData));  
                            
                            instance.submit();
                        } 
                });
             }
        );
    }
    else {
        console.log("GOING HERE>")
        var invoiceData = {
            'fullName': $('#fullNameCheckout').val(),
            'companyName': $('#companyNameCheckout').val(),
            'addressOne': $('#addressOneCheckout').val(),
            'addressTwo': $('#addressTwoCheckout').val(),
            'city': $('#cityCheckout').val(),
            'region': $('#regionCheckout').val(),
            'country': $('#countryCheckout').val(),
            'zip': $('#zipCheckout').val(),
            'cart': '',
            'total': $('#checkout-total').html()
        }
        
        if (invoiceData.addressTwo == ""){
            invoiceData.addressTwo = "NA";
        }

        if (invoiceData.companyName == ""){
            invoiceData.companyName = "NA";
        }
        
        if (invoiceData.region == ""){
            invoiceData.region = "NA";
        }
        
        let tempQuantity = []
        let tempName = []
        let tempPrice = [];
        
        $(".quantity-checkout").each(function() {
            tempQuantity.push($(this).html());
        });

        $(".name-checkout").each(function() {
            tempName.push($(this).html());
        });

        $(".price-checkout").each(function() {
            tempPrice.push($(this).html());
        });

        let tempObject = []
        let index = 0; 
        for (let x of tempQuantity) {
            console.log("X VALUES")
            console.log(x)
            var object = {
                "quantity": tempQuantity[index],
                "name": tempName[index],
                "price": tempPrice[index],
                
            }
            index++;
            tempObject.push(object);
        }

        invoiceData.cart = tempObject;

        console.log(invoiceData);
        window.localStorage.setItem('windowStorage', JSON.stringify(invoiceData));  
        instance.submit();
                // while (true) {
                //     if (invoiceData.cart) {
                //         break
                //     }
                // }
    }
    
    
};



$('#invoice-done').on('click', invoiceDone);
function invoiceDone(event) {
    event.preventDefault();
    window.location.href = "/"
}



$('#searchBtn').on('click', searchKeyword);
function searchKeyword(event) {
    event.preventDefault();

    if (window.location.pathname !== '/'){
        window.localStorage.setItem('keyword', $('#keyword').val().split(' '));
        console.log(window.localStorage.getItem('keyword'));
        window.location.href = '/';
    } else {
        const result = [];
        console.log("DISINI")
        fetch('/data').
        then(response => {
            if (response.status==200) {
                response.json().then(
                    data => {
                        const keywords = $('#keyword').val().split(' ');
                        const categories = [];
                        for (let music of data.data){
                            if (!categories.includes(music.category)){
                                categories.push(music.category);
                            }
                            for(let keyword of keywords){
                                if (music.name.includes(keyword) || music.composer.includes(keyword)){
                                    result.push(music);
                                }
                            }
                        }
                        populateResults(result);

                    }
                )
            }
        })
    }
    
   

    
    
    
    
        
    
};

const populateCategory = (data) => {
    let results = '';
    for (let category of data) {
        results+= `
            <a href='category/${encodeURIComponent(category)}'>${category}</a>`;
    }
    $('#category-list').html(results);  
}

const populateResults = (data) => {
    let results = '';
    for (let music of data) {
        results+=`
            <div class="music-card">
                <div class="card-content">
                    <a href='/music/${music._id}'>${music.name}</a>
                    <br>
                    <img src='../../Materials/${music.image}'></img>
                    <div class="card-detail">
                    
        `;
        if (music.newArrival === 'Yes'){
            results+= `
                <p id="new-arrival">NEW ARRIVAL !</p>`
        }
        results+=`
                <p id="composer">Composer: ${music.composer}</p>
                <p id="price">Price: ${music.price}</p>
            </div>
        </div>
    </div>`
    }
    
    $('#filter').html('Searching Results');
    $('#music-list').html(results);  
    
};

const populateCart = (data) => {
    let results = '';
    let total = 0;
    for (let music of data) {
        console.log(music)
        results+=`
            <div class="cart-card">
                <h2> ${music.musicName} </h2>
                <p> Price: $${ music.musicPrice }</p>
                <p> Quantity: ${music.quantity}</p>
                <button class="deleteCart" onclick="deleteCart(event, this)" name="${music._id}"> Delete </button>
            </div>  
        `;
        total += (music.musicPrice * music.quantity);
    }
    console.log(total);
    $('#cart-list').html(results);
    $('#card-total').html("Total Price: HK$ " + total);  
    
};
