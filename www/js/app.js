$(document).ready(function()
{
	document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady(){
    //console.log('device is ready');

    if(localStorage.channel == null || localStorage.channel == '')
    {
    	$('#popupDialog').popup("open");
    }
    else
    {
    	var channel = localStorage.getItem('channel');
    }
    if(localStorage.maxResults == null || localStorage.maxResults == '')
    {
    	localStorage.setItem('maxResults', 10);
    }
    //var channel = '1001recepti';

    getPlaylist(channel);

    $(document).on('click', '#vidList li', function()
    {
    	showVideo($(this).attr('videoId'));
    })

    $('#channelBtnOK').click(function(){
    	var channel = $('#channelName').val();
    	console.log(channel);
    	setChannel(channel);
    	getPlaylist(channel);
    })

    $('#saveOptions').click(function(){
    	saveOptions();
    })
    $('#clearChannel').click(function(){
    	clearChannel();
    })

    $(document).on('pageinit', '#options', function(e){
    	var channel = localStorage.getItem('channel');
    	var maxResults = localStorage.getItem('maxResults');
    	
    	$("#channelNameOptions").attr('value', channel);
    	$("#maxResultsOptions").attr('value', maxResults);
    })
}

function getPlaylist(channel)
{
	$('#vidlist').html='';
	$.get(
		"https://www.googleapis.com/youtube/v3/channels",
		{
			part: 'contentDetails',
			forUsername: channel,
			key: 'AIzaSyBg6KcHvLjfvmD6VGVX1D3FltVVCUyIzio'
		},
		function(data)
		{
			$.each(data.items, function(i, item)
			{
				//console.log(item);
				playlistId = item.contentDetails.relatedPlaylists.uploads;
				getVideos(playlistId, localStorage.getItem('maxResults'));
			})
			//console.log(data);
		}
		);
}
function getVideos(playlistId, maxResults)
{
	$.get("https://www.googleapis.com/youtube/v3/playlistItems",
	{
		part: 'snippet',
		maxResults: maxResults,
		playlistId: playlistId,
		key: 'AIzaSyBg6KcHvLjfvmD6VGVX1D3FltVVCUyIzio'
	},
	function(data)
	{
		console.log(data.items);
		var output;
		$.each(data.items, function(i, item)
		{
			id = item.snippet.resourceId.videoId;
			title = item.snippet.title;
			thumbnail = item.snippet.thumbnails.default.url;
			$('#vidList').append('<li videoId="'+id+'"><img src="'+thumbnail+'"><h3>'+title+'</h3></li>');
			$('#vidList').listview('refresh');
		})
		
	}
	)
}

function showVideo(videoId)
{
	console.log('showing video' + videoId);
	$('#logo').hide();
	var output = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+videoId+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
	$('#showVideo').html(output);
}

function setChannel(channel)
{
	localStorage.setItem('channel', channel);
	console.log('channel set ' + channel);
}

function setMaxResults(maxResults)
{
	localStorage.setItem('maxResults', maxResults);
	console.log('maxResults set ' + maxResults);
}

function saveOptions(channel)
{
	var channel = $('#channelNameOptions').val();
	setChannel(channel);
	var maxResults = $('#maxResultsOptions').val();
	setMaxResults(maxResults);
	$('body').pagecontainer('change', '#main', {options});
	getPlaylist(channel);
}