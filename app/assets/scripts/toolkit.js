// HELPERS
// #######
var systemFile = function(filename){
  if (filename.indexOf('.') === 0){
    return true;
  } else { return false; }
};
var typeIcon = function(extension){
  switch(extension) {
    case ".doc":
    case ".docx":
      return '<i class="fa fa-fw fa-file-word-o"></i> '
      break;
    case ".jpeg":
    case ".jpg":
    case ".png":
      return '<i class="fa fa-fw fa-file-image-o"></i> '
      break;
    case ".pdf":
      return '<i class="fa fa-fw fa-file-pdf-o"></i> '
      break;
    case ".ppt":
    case ".pptx":
      return '<i class="fa fa-fw fa-file-powerpoint-o"></i> '
      break;
    case ".xls":
    case ".xlsm":
    case ".xlsx":
      return '<i class="fa fa-fw fa-file-excel-o"></i> '
      break;
    case ".zip":
      return '<i class="fa fa-fw fa-file-archive-o"></i> '
      break;
    default:
      return '<i class="fa fa-fw fa-file-o"></i> '
  }
};

// GLOBAL VARIABLES
// ################
var data;

// FUNCTION CHAIN
// ##############
function fetchData(){

  $.ajax({
    type: "GET",
    url: "https://webviz.redcross.org/rapidresponse/toolkit",
    error: function(err){
      $(".error-message-toolkit").show();
    },
    success: function(response){
      console.log(response)
      if(response.length === 0){
        $(".error-message-toolkit").show();
      } else {
        buildToolkit(response);
      }
    }
  })

}

function buildToolkit(data){
  
  $('.contents').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
  $(".error-message-toolkit").hide();

}



fetchData();
