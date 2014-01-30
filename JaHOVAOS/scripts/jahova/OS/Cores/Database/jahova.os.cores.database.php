<?php

//Input request structure
//db.url = "demo.jahovaos.com";
//db.un = "devry";
//db.pw = "student";
//db.db = "servers";
//db.queryType = "SELECT";
//db.query = "SELECT * FROM available";

if($_SERVER['HTTP_ORIGIN'] == "http://demo.jahovaos.com")
{
    header('Access-Control-Allow-Origin: http://demo.jahovaos.com');
    ini_set("display_errors","1");
    ERROR_REPORTING(E_ALL);
    
    
    try {
        $request = json_decode($_POST["JSON"]);
        $db = mysql_connect($request->url, $request->un, $request->pw) or die(mysql_error());
        mysql_select_db($request->db) or die(mysql_error());
        
        if(strtoupper($request->queryType) == "SELECT"){ 
            $result = mysql_query($request->query) or die(mysql_error());
            $output = array();
            $i = 0;
            while($row = mysql_fetch_array( $result ))
            {
            	$output[$i] = $row;
                $i++;
            } 
            
            if(count($output) > 0){
                echo json_encode($output);
            }
            else{
                echo '0';
            }
        }
        elseif(strtoupper($request->queryType) == "INSERT"){
            $result = mysql_query($request->query) or die(mysql_error());
            
            //Returns 1 or 0, (true or false);
            echo $result;
        }
        elseif(strtoupper($request->queryType) == "UPDATE"){
            $result = mysql_query($request->query) or die(mysql_error());
            
            //Returns 1 or 0, (true or false);
            echo $result;
        }
        elseif(strtoupper($request->queryType) == "DELETE"){
            $result = mysql_query($request->query) or die(mysql_error());
            
            //Returns 1 or 0, (true or false);
            echo $result;
        }
        else{
            echo 'Unknow Query Type';
        }
        
        
        mysql_close($db);
        
        
    } catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
}
else{
    echo "Not allowed to view this information";
}

//
//  Sample Queries
//

//INSERT
// Insert a row of information into the table "example"
//mysql_query( "INSERT INTO available(IP, lifetime, utimestamp) VALUES('70.234.209.44', '0', '1285823160')" ) 

//SELECT
// Get all the data from the "available" table
//$result = mysql_query("SELECT * FROM available") 
//$result = mysql_query("SELECT * FROM available WHERE ID='2'")  

//UPDATE
// Update Record
//$result = mysql_query("UPDATE available SET lifetime='7200' WHERE ID='2'") 

//DELETE
// Delete Record from the "available" MySQL table
//mysql_query("DELETE FROM available WHERE lifetime >'0'")  


?>
