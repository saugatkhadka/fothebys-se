    // var drawingCategory = document.getElementById('drawingCategory');
    // drawingCategory.onClick
    // console.log(drawingCategory);

    function resetUserInput(){
        // Clearing all disabled form input so it doesn't persist
        document.getElementById('admin_post').disabled = true;
        document.getElementById('buyer_approved_status').disabled = true;
        document.getElementById('buyer_bank_account_no').disabled = true;
        document.getElementById('buyer_bank_sort_card').disabled = true;

        // Disabling the form inputs according to the category
        document.getElementById('adminDiv').style.display = "none";
        document.getElementById('buyerSellerDiv').style.display = "none";
        // document.getElementById('imageTypeDiv').style.display = "none";
        // document.getElementById('materialUsedDiv').style.display = "none";
        // document.getElementById('isFramedDiv').style.display = "none";
        // document.getElementById('dimensionDiv').style.display = "none";
        // document.getElementById('weightDiv').style.display = "none";
    }

    function handleClick(role){
        resetUserInput();
        // document.getElementById("resetUserInput").style.display = "none";

        switch(role.id) {
            // When drawing category is selected, remove all non related form inputs
            case "admin":
            case "staff":
                document.getElementById('admin_post').disabled = false;
                
                document.getElementById('adminDiv').style.display = "block";
                // console.log(document.getElementById('adminDiv'));
                break;

            case "buyer":
            case "seller":
            case "joint":
                document.getElementById('buyer_approved_status').disabled = false;
                document.getElementById('buyer_bank_account_no').disabled = false;
                document.getElementById('buyer_bank_sort_card').disabled = false;

                document.getElementById('buyerSellerDiv').style.display = "block";
                break;

            default:
                console.log("Invalid Selection");
        } // switch case ends
    }// handleClick Ends

    function checkInputOnEdit() {

        if(document.getElementById('admin').checked || document.getElementById('staff').checked){
            handleClick(document.getElementById('admin'));
        } else if(document.getElementById('buyer').checked || document.getElementById('seller').checked || document.getElementById('joint').checked){
            handleClick(document.getElementById('buyer'));
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Display set to none, since no category selected

        // Disabled due to clearing the inputs in the edit form
        resetUserInput();

        // TODO: Enable when the edit page is created
        checkInputOnEdit();
        
    });
    