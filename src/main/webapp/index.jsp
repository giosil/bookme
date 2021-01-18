<!DOCTYPE html>
<%
	Object message = request.getAttribute("message");
	if(message == null) message = "";
%>
<html lang="it">
<head>
  <title>BookMe</title>
</head>
<body>
  <h1>BookMe module 1.0.0</h1>
  
  <strong><%=  message %></strong>
</body>
</html>