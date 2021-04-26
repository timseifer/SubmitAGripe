<?php
if(isset($_POST['submit'])){

    $title = $_POST['title'];
    $gripe = $_POST['gripe'];
    $category = $_POST['category'];


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