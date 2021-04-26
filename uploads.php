//this is the code to submit files to a database
<?php
if(isset($_POST['submit'])){

    $file = $_FILES['file'];
    $filename = $_FILES['name'];
    $fileSize = $_FILES['size'];
    $fileTmp = $_FILES['tmp_name'];
    $fileError = $_FILES['error'];
    $fileType = $_FILES['type'];

    $fileExt = explode('.',$filename);
    $fileactext = strtolower(end($fileExt));

    $allowed = array('jpg','gif','pdf','jpeg','png');

    if(in_array($fileactext, $allowed)){
        if($fileError == 0){
            $filenameNew = uniquid('',true).".".$fileactext;
            
            
    ////// Change the file destination to upload it to MongoDb
            $fileDestination = 'finalproj/'.$filenameNew;  
            move_uploaded_file($fileTmp,$fileDestination)
        }else{
            echo "Error uploading file";
        }
    }
    else{
        echo "File not allowed";
    }
}
?>
