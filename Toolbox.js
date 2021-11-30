var NoOfResultsRequested;
function searchForTrack(e) {																														//Function pou elegxei ta plhktra otan pliktrologoume sto searchbox an to plhktro einai to enter
	if (e.keyCode == 13) {
		var TypedInSearchBox = document.getElementById("find").value;																				//An nai pernaei oti plhktologhthike sto searchbox se mia metavlhth
		do{
			NoOfResultsRequested=0;
			NoOfResultsRequested = prompt("How many results of this search do you need?", "1-100");
		}while(isNaN(NoOfResultsRequested) || NoOfResultsRequested<0 || NoOfResultsRequested >100);
		var SearchTrackLink = "https://cir.di.ionio.gr/mir/playlist_api/?searchTrackMetadata&query="+TypedInSearchBox+"&return_type=json";		//Kai ti xrisimopoiei gia na sximatistei to link pou tha mas dosei ta apotelesmata gia ti sigkekrimeni anazitisi
		var stype = 0;																																//Dilonoume oti anazhtoume Kommati pou periexei auto pou pliktrologisame kai oxi Successor

		document.getElementById("Search results").innerHTML = "Search Results: ";																	//Allazoume ton titlo sthn aristeri pleura gia na tairiazei me ta apotelesmata pou dinontai
		get_tracks(SearchTrackLink, stype);																											//Klisi tis function pou tha mas dosei ta apotelesmata tis anazitisis

		return false;																																//false gia na min epistrefei tipota apo ton elegxo ton pliktron (gia enter) pio panw
	}
}

function getSuccessors(tid){																									//Function pou kaleitai gia na dilosoume ton tupo anazitisis diladi gia successor kai na kalesei ti function pou tha mas dwsei ta apotelesmata tis anazitisis
	do{
		NoOfResultsRequested=0;
		NoOfResultsRequested = prompt("How many successors of this track do you need?", "1-100");
	}while(isNaN(NoOfResultsRequested) || NoOfResultsRequested<0 || NoOfResultsRequested >100);													//Erotisi sto xristi gia to posous successors thelei
	var SearchForSuccessors = "https://cir.di.ionio.gr/mir/playlist_api/?getKSuccessors&track_id="+tid+"&k="+NoOfResultsRequested;		//Sximatismos tou link pou tha mas dosei ta apotelesmata gia ti sigkekrimeni anazitisi
	var stype = 1;																												//Dilonoume oti anazhtoume Successors kai oxi Kommati

	document.getElementById("Search results").innerHTML = tid+"\'s successors:";	//Allazoume ton titlo sthn aristeri pleura gia na tairiazei me ta apotelesmata pou dinontai
	get_tracks(SearchForSuccessors, stype);											//Klisi tis function pou tha mas dosei ta apotelesmata tis anazitisis
}

function get_tracks(diApiLink, searchtype){											//Function pou tha mas dosei ta apotelesmata tis anazitizis pairnontas ws arguments to link gia tin epistrofi ton apotelesmaton kai ton tupo anazitisis (kommati/successor)

	jQuery.get( diApiLink, function( data ) {										//H jQuery pou tha parei ta apotelesmata apo ti selida tou link kai tha ta epistrepsei os orisma sthn parakato function

		//obj = JSON.parse(data);														//Kanoume parse ta apotelesmata kai ekxwrhsh tous se mia metavlhth
		obj = data;
		if ( obj.error == "true"){													//Elegxos gia errors opos perigrafontai stis odigies tis ergasias
			if( obj.error_id == 0 ){
				alert("Please type something (else) to search for.");
				document.getElementById("searchresults_text").innerHTML = "";		//Adeiasma twn apotelesmaton anazitisis
				document.getElementById("Search results").innerHTML = "";
			}
			if( obj.error_id == 1 ){												//Elegxos gia errors opos perigrafontai stis odigies tis ergasias
				alert("Return type is not one of the values allowed.");
				document.getElementById("searchresults_text").innerHTML = "";		//Adeiasma twn apotelesmaton anazitisis
				document.getElementById("Search results").innerHTML = "";
			}
			if( obj.error_id == 2 ){
				alert("The track\'s ID was not found in the database.");
				document.getElementById("searchresults_text").innerHTML = "";		//Adeiasma twn apotelesmaton anazitisis
				document.getElementById("Search results").innerHTML = "";
			}
			if( obj.error_id == 3 ){												//Elegxos gia errors opos perigrafontai stis odigies tis ergasias
				alert("The successors\'s number asked was either not set or invalid.\nPlease give an other value.");
				document.getElementById("searchresults_text").innerHTML = "";		//Adeiasma twn apotelesmaton anazitisis
				document.getElementById("Search results").innerHTML = "";
			}
		}
		else if (obj.results.length == 0){																			//An i anazitisi den einai lathos alla den iparxoun apotelesmata na emfanizei to analogo minima sto xristi
			alert("No results found for " + res + ".");
			document.getElementById("searchresults_text").innerHTML = "";											//Adeiasma twn apotelesmaton anazitisis
			if( searchtype == 0 ){																					//Elegxos tipou anazitisis
				document.getElementById("Search results").innerHTML = "No suggestions found for this track.";		//Emfanisi analogou minimatos an anazitoume aplo kommati
			}
			else if( searchtype == 1 ){																				//Elegxos tipou anazitisis
				document.getElementById("Search results").innerHTML = "No search results found for this track.";	//Emfanisi analogou minimatos an anazitoume successor
			}
		}
		else if (NoOfResultsRequested>0){
			document.getElementById("searchresults_text").innerHTML = "";											//Adeiasma twn apotelesmaton anazitisis

			$.each(obj.results, function() {																		//Gia kathe aapotelesma tupou results
				if (NoOfResultsRequested!=0){
					if( searchtype == 0 ){																				//An anazitame aplo kommati
						var tid = this.track_id;																			//Antistoixisi tou analogou id
					}
					else if( searchtype == 1 ){																			//An anazitoume successor
						var tid = this.successor_track_id;																	//Antistoixisi tou analogou id
					}
					get_apple_snippet(this.track_title, this.artist_name, tid, "#searchresults_text");					//Klisi tis function gia to sximatismo ton apotelesmaton
					NoOfResultsRequested--;
				}
			});
		}

	});
}

function get_apple_snippet(title, artist, tid, element_id_to_change)												//Function gia to sximatismo ton apotelesmaton i opoia pairnei os orismata ton titlo tou kommatiou apo ta apotelesmata, tou opoio prospelaunoume kathe fora, ton kallitexni, to ID tou kommatiou kai to arxeio me ID searchresults_text sto opoio prostithontai ta epistrefomena
{
	var tiar = title + " by " + artist;																				//Define a variable to store track title and artist in a "Title by Artist" form

	jQuery.getJSON("https://cir.di.ionio.gr/mir/playlist_api/apple_api_intermediate.php?search_string="+tiar, function(temp_data, status)	//Sximatismos tou link pou tha mas dosei ta apotelesmata gia ti sigkekrimeni anazitisi kai epistrofi auton se mia function
	{
		var no_of_results = parseInt(temp_data.resultCount);														//Katametrisi ton apotelesmaton kai ekxorisi tou plithous se mia metavliti
		//Sximatismos tou stoixeiou tis listas pou tha epistrafei an den vrethei audio preview ##1
		var html_to_return = ' <li><img title="Click to add track to Playlist" style="float: left; id="theImg" src="assets/vicon.png" onclick="Move_to_Playlist('+'\''+tid+'\''+')" /><div>'+title+' by <span style="color: #00c9c9;">'+artist+'</span><span style ="font-size: small; display: block; margin-left: 60px" title="Audio preview not available" class="fa-stack fa-lg"><i class="fa fa-play fa-stack-1x"></i> <i style="color: #8b1a89;" class="fa fa-ban fa-stack-2x text-danger"></i></span></div></li><br>';

		if (no_of_results > 0)																						//An ta apotelesmata einai perissotera apo 1
		{
			var result_no = 0; 																						//Katametrisi apotelesmaton pou tha prospelastoun sti while pio kato

			while(result_no < no_of_results)																		//Ektelesi tis while gia ola ta apotelesmata sti metavliti temp_data pou
			{
				if (typeof(temp_data.results[result_no].previewUrl) == 'undefined')									//An de vrethei audio preview gia to sugkekrimeno apotelesma proxvrame sto epomeno apotelesma me tin epomeni ektelesi tis while
					result_no++;
				else																								//An vrethei apotelesma me audio preview
				{
					//Sximatismos kai tou stoixeiou tis listas pou tha epistrafei an vrethei audio preview ##2
					html_to_return = ' <li><img title="Click to add track to Playlist" style="float: left; id="theImg" src="assets/vicon.png" onclick="Move_to_Playlist('+'\''+tid+'\''+')" /><div>'+title+' by <span style="color: #00c9c9;">'+artist+'</span></div><audio  src="'+temp_data.results[result_no].previewUrl+'" type="audio/mp4" controls>Your browser does not support the audio tag.</audio></li><br>';

					break;
				}
			}
		}
		jQuery(element_id_to_change).append(html_to_return);																		//Prosthetoume to stoixeio sti lista eite einai ##1 periptosi (xoris audio preview) eite einai ##2 periptosi (me audio preview)

	});
}

function Move_to_Playlist(tid){																												//Function gia ti metakinisi ton kommation apo ti lista ton apotelesmaton stin Playlist me orisma to ID tou kommatiou gia to opoio klithike i function

	var track_to_return = tid;																												//Ekxwrish tou orismatos tis function (track_id) se mia metavliti
	var mylinktoTrackID = "https://cir.di.ionio.gr/mir/playlist_api/?getTrackMetadata&track_id="+track_to_return+"&return_type=json";		//Sximatismos tou link pou tha mas dosei to apotelesma gia ti sigkekrimeni anazitisi

	jQuery.get( mylinktoTrackID, function( data1 ) {																						//H jQuery pou tha parei ta apotelesmata apo ti selida tou link kai tha ta epistrepsei os orisma sthn parakato function

		//objID = JSON.parse(data1);																											//Kanoume parse ta apotelesmata kai ekxwrhsh tous se mia metavlhth
		objID = data1;
		if ( objID.error == "true"){
			if( objID.error_id == 0 ){																										//Elegxos gia errors opos perigrafontai stis odigies tis ergasias
				alert("Track ID was was either not set or invalid.\nPlease give an other value.");
				//document.getElementById("play_text").innerHTML = "";																		//Lathos grammi--------------------------------------------------
			}
			if( objID.error_id == 1 ){																										//Elegxos gia errors opos perigrafontai stis odigies tis ergasias
				alert("Return type is not one of the values allowed.");
				//document.getElementById("play_text").innerHTML = "";																		//Lathos grammi--------------------------------------------------
			}
			if( objID.error_id == 2 ){																										//Elegxos gia errors opos perigrafontai stis odigies tis ergasias
				alert("The track\'s ID was not found in the database.");
				//document.getElementById("play_text").innerHTML = "";																		//Lathos grammi--------------------------------------------------
			}
		}
		else if (objID.results.length == 0){																								//An i anazitisi den einai lathos alla den iparxoun apotelesmata na emfanizei to analogo minima sto xristi
			alert("No track found for " + track_to_return + ".");
			//document.getElementById("play_text").innerHTML = "";																			//Lathos grammi--------------------------------------------------
		}
		else{
			//Sximatismos tou stoixeiou pou tha prostethei stin Playlist
			var track_to_add = ' <li class="ui-state-default" id="'+tid+'" value="'+tid+'" title="Drag & Drop to rearrange\nDrag up a little to see this track\'s priority in Playlist"><img style="float: left; id="theImg" src="assets/vicon.png"/>'+objID.results[0].track_title+' by <span style="color: #00c9c9;">'+objID.results[0].artist_name+'</span><span onclick="RemoveItem('+'\''+tid+'\','+tid+')" style ="font-size: small;" title="Click to delete track from Playlist" class="fa-stack fa-lg"><i style="color: #8b1a89;" class="fa fa-trash-o fa-stack-2x"></i></span><span onclick="getSuccessors('+'\''+tid+'\''+')" style ="font-size: small;" title="Click to get this track\'s successors" class="fa-stack fa-lg"><i style="color: #8b1a89;" class="fa fa-question-circle-o fa-stack-2x"></i></span><br><br><br></li>';

			var mark = false;																												//Apo default de markarei to kommati
			var alex = $('[value="'+tid+'"]');																								//Gia kathe kommati me to track_id tou kommatiou pou prospathoume na perasoume stin Playlist kanei elegxo gia duplicates
			if( alex.length>0){																												//An uparxoun emfanizei erotisi sto xristi gia to an thelei na perasei sto kommati stin playlist
				if (confirm('This track has already been added to the Playlist. \n(Future deletion of the track is going to affect the first one in the Playlist)\nAre you sure you want to add it again?')) {
					var ids = $('[value="'+tid+'"]');																						//An nai elegxei ola ta stoixeia pou exoun value to sigkekrimeno track_id
					//Sximatismos tou markarismenou stoixeiou pou tha prostethei stin Playlist
					track_to_add = ' <li class="ui-state-default" class="duplicate" id="'+tid+ids.length+'" value="'+tid+'" title="Drag & Drop to rearrange\nDrag up a little to see this track\'s priority in Playlist"><img style="float: left; id="theImg" src="assets/vicon.png"/>'+objID.results[0].track_title+' by <span style="color: #00c9c9;">'+objID.results[0].artist_name+'</span><span onclick="RemoveItem('+'\''+tid+ids.length+'\','+tid+')" style ="font-size: small;" title="Click to delete track from Playlist" class="fa-stack fa-lg"><i style="color: #8b1a89;" class="fa fa-trash-o fa-stack-2x"></i></span><span onclick="getSuccessors('+'\''+tid+'\''+')" style ="font-size: small;" title="Click to get this track\'s successors" class="fa-stack fa-lg"><i style="color: #8b1a89;" class="fa fa-question-circle-o fa-stack-2x"></i></span><br><br><br></li>';

					mark = true;																											//Check for duplicates = ON
				}
				else{
					track_to_add = "";																										//An oxi adeiazei to sximatismeno stoixeio oste na min prostethei kati stin playlist
					mark = false;																											//Check for duplicates = OFF
				}
			}
			if(mark){																														//An to mark einai true kane elegxo gia duplicates kai markare kai ta ipoloipa idia kommatia me to sugkekrimeno track_id
				jQuery('#play_text').append(track_to_add);																					//Prosthiki tou kommatiou pou sximatistike stin if pio pano, mesa stin playlist
				$("li[value="+tid+"]").each(function(){																						//Elegxei ola ta stoixeia <li> tis listas, pou exoun value to idio track_id
					var ids = $('[value="'+tid+'"]');																						//Ekxorei to plithos ton apotelesmaton me value to idio track_id se mia metavliti
					if(ids.length>1){																										//Gia kathe ena apo auta ta kommatia, an einai perissotera apo 1...
						$("li[value="+tid+"]").each(function(){																				//...kai exoun value to idio track_id...
							$(this).addClass('duplicate');																					//...ksekina to markarisma
						});
					}
				});
			}
			else{
				jQuery('#play_text').append(track_to_add);																					//An to mark einai false apla perna to kommati stin playlist
			}
		}
	});
}

function RemoveItem(list_item_id, gid){																										//Function gia diagrafi kommation apo tin playlist pou dexetai os orismata to id tou stoixeiou kai to track_id gia elegxo markarismatos
	if (confirm('Are you sure you want to delete this track from the Playlist?')) {															//Erotisi sto xristi gia ti diagrafi tou kommatiou
		$('#'+list_item_id).remove();																										//Ektelesi tis diagrafis
		$("li[value="+gid+"]").each(function(){																								//Anazitisi stoixeion listas me timi to track_id pros elegxo markarismatos
			var ids = $('[value="'+gid+'"]');																								//Ekxorisi tou plithous ton apotelesmaton se mia metavliti
			if(ids.length<2){																												//An exei meinei mono ena kommati me auto to track_id...
				$(this).removeClass('duplicate');																							//...ksemarkare
			}
		});
	}
}

function showINFO(){																														//Emfanisi pliroforion gia ti xrisi tou UI
	alert("Hi, this is a DJ Decision Support System page\nby Psarras Konstantinos.\n\n- You can search for tracks by typing it's title or artist in the search bar on the left and sumbit it by hitting the enter button.\n- You are able to listen to a sample of the track if it is available in the database.\n- By clicking in the vinyl image to their left you can add the specific track in the Playlist to the right.\n- In the Playlist you are able to rearrange the list using Drag & Drop.\n- You can delete a track from the list by clicking on the trash bin icon.\n- You are also given the option to get an amount you want of suggested songs for each track in the Playlist by clicking their purple ? icon, if suggestions exist in the database.")
}
