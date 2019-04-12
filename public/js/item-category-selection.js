    // var drawingCategory = document.getElementById('drawingCategory');
    // drawingCategory.onClick
    // console.log(drawingCategory);

    function resetCategoryInput(){
        // Clearing all disabled form input so it doesn't persist
        document.getElementById('drawingMedium').disabled = true;
        document.getElementById('paintingMedium').disabled = true;
        document.getElementById('imageType').disabled = true;
        document.getElementById('materialUsed').disabled = true;
        document.getElementById('isFramed').disabled = true;
        document.getElementById('dimension').disabled = true;
        document.getElementById('weight').disabled = true;

        // Disabling the form inputs according to the category
        document.getElementById('drawingMediumDiv').style.display = "none";
        document.getElementById('paintingMediumDiv').style.display = "none";
        document.getElementById('imageTypeDiv').style.display = "none";
        document.getElementById('materialUsedDiv').style.display = "none";
        document.getElementById('isFramedDiv').style.display = "none";
        document.getElementById('dimensionDiv').style.display = "none";
        document.getElementById('weightDiv').style.display = "none";
    }

    function handleClick(radioCategory){
        resetCategoryInput();
        document.getElementById("categoryNotSelectedMessage").style.display = "none";

        switch(radioCategory.id) {
            // When drawing category is selected, remove all non related form inputs
            case "drawingCategory":
                // Enabling the category form input 
                document.getElementById('drawingMedium').disabled = false;
                document.getElementById('isFramed').disabled = false;
                document.getElementById('dimension').disabled = false;

                // Showting the category form inputs
                document.getElementById('drawingMediumDiv').style.display = "block";
                document.getElementById('isFramedDiv').style.display = "block";
                document.getElementById('dimensionDiv').style.display = "block";


                // console.log(document.getElementById('weight'));
                break;

            case "paintingCategory":
                // Enabling the category form input 
                document.getElementById('paintingMedium').disabled = false;
                document.getElementById('isFramed').disabled = false;
                document.getElementById('dimension').disabled = false;

                // Showting the category form inputs
                document.getElementById('paintingMediumDiv').style.display = "block";
                document.getElementById('isFramedDiv').style.display = "block";
                document.getElementById('dimensionDiv').style.display = "block";
                break;

            case "photoCategory":
                // Enabling the category form input 
                document.getElementById('imageType').disabled = false;
                document.getElementById('dimension').disabled = false;

                // Showting the category form inputs
                document.getElementById('imageTypeDiv').style.display = "block";
                document.getElementById('dimensionDiv').style.display = "block";
                break;

            case "sculpturesCategory":
                document.getElementById('materialUsed').disabled = false;
                document.getElementById('dimension').disabled = false;
                document.getElementById('weight').disabled = false;


                document.getElementById('materialUsedDiv').style.display = "block";
                document.getElementById('dimensionDiv').style.display = "block";
                document.getElementById('weightDiv').style.display = "block";
                break;

            case "carvingsCategory":
                document.getElementById('materialUsed').disabled = false;
                document.getElementById('dimension').disabled = false;
                document.getElementById('weight').disabled = false;

                document.getElementById('materialUsedDiv').style.display = "block";
                document.getElementById('dimensionDiv').style.display = "block";
                document.getElementById('weightDiv').style.display = "block";
                break;

            default:
                console.log("Invalid Selection");
        } // switch case ends
    }// handleClick Ends

    function checkCategoryOnEdit() {

        if(document.getElementById('drawingCategory').checked){
            handleClick(document.getElementById('drawingCategory'));
        } else if(document.getElementById('paintingCategory').checked){
            handleClick(document.getElementById('paintingCategory'));
        } else if(document.getElementById('photoCategory').checked){
            handleClick(document.getElementById('photoCategory'));
        } else if(document.getElementById('sculpturesCategory').checked){
            handleClick(document.getElementById('sculpturesCategory'));
        } else if(document.getElementById('carvingsCategory').checked){
            handleClick(document.getElementById('carvingsCategory'));
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Display set to none, since no category selected
        resetCategoryInput();
        
        checkCategoryOnEdit();
        


    });
    