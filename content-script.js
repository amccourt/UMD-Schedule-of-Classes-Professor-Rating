setInterval(function() { 
  //  Get all Section Instructor Container DIVs
  var sectionInstructorContainers = document.getElementsByClassName("section-instructors-container six columns");

  //  Only continue if at least one section list is expanded
  if (sectionInstructorContainers.length > 0) {

    //  Get all Section Instructor DIVs
    var sectionInstructorList = document.getElementsByClassName("section-instructor");

    //  Iterate over each Section Instructor
    var testArr = Array.prototype.slice.call(sectionInstructorList);
    testArr.forEach(function(sectionInstructor) {
    //for (var i = 0; i < sectionInstructorList.length; i++) {

      //  Grab Prof. name
      var innerText = sectionInstructor.innerText;

      //  Get only Prof. last Name
      var splitName = innerText.split(" ");
      var lName     = splitName[splitName.length - 1];

      //  Create URL using lName
      var url = "https://search.mtvnservices.com/typeahead/suggest/?solrformat=true&rows=20&q=" + lName + "+AND+schoolid_s%3A1270&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&rows=20&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s&fq=&prefix=schoolname_t%3A%22University+of+Maryland%22";
      
      // AJAX call
      var promised = promiseFunction(url);

      //  Use .done to ensure that the AJAX call is completed
      promised.done(function(data) {
        // numFound indicates number of professors found at UMD with this last name
        var numFound = data.response.numFound;

        //  Don't re-add the score if its already there 
        if (sectionInstructor.children.length == 0 || sectionInstructor.children[0].tagName == 'A') {
          //  Create new element element
          var newElt = document.createElement("span");

          // If numFound > 0, add score to the left.  Else, add N/A to the left.
          if (numFound > 0) {
            //  Get averageRating
            var averageRating = data.response.docs[0].averageratingscore_rf;

            //  Bugfix change undefined types to regular N/A
            if (typeof averageRating === 'undefined') {
              // Populate new element and add style
              var newContent = document.createTextNode("N/A");
              newElt.appendChild(newContent);
              newElt.style.cssText = 'display:inline-block;background-color:grey;padding-left:5px;padding-right:5px;margin-right:5px;color:white;border-radius:5px;';
            } else {
              // Populate new element and add style
              var newContent = document.createTextNode(averageRating);
              newElt.appendChild(newContent);

              if (averageRating >= 3.5) {
                newElt.style.cssText = 'display:inline-block;background-color:green;padding-left:5px;padding-right:5px;margin-right:5px;color:white;border-radius:5px;';
              } else if (averageRating >= 2.5) {
                newElt.style.cssText = 'display:inline-block;background-color:orange;padding-left:5px;padding-right:5px;margin-right:5px;color:white;border-radius:5px;';
              } else {
                newElt.style.cssText = 'display:inline-block;background-color:red;padding-left:5px;padding-right:5px;margin-right:5px;color:white;border-radius:5px;';
              }
            }

          } else {
            // Populate new element and add style
            var newContent = document.createTextNode("N/A");
            newElt.appendChild(newContent);
            newElt.style.cssText = 'display:inline-block;background-color:grey;padding-left:5px;padding-right:5px;margin-right:5px;color:white;border-radius:5px;';
          } 
          //  Add the new DIV before the text of the section leader
          sectionInstructor.insertBefore(newElt, sectionInstructor.childNodes[0]);
        }
      });


    //}
    });
  } 
}, 500); //  Interval of refresh

//  Promise function to manipulate asynchronous calls
function promiseFunction(url) {
  return $.ajax({
    url: url,
    dataType: 'json',
    type: 'GET'
  });
}
