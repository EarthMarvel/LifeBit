$('#loginForm').submit((event) => {
  event.preventDefault(); // 이벤트 발생 시 새로고침을 방지하는 메소드.

  const formData = {
    email: $('#email').val(),
    password: $('#password').val(),
  };

  $.ajax({
    url: 'http://localhost:3000/user/log-in',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(formData),
    success: (data) => {
      // 응답이 성공적인 경우
      alert('로그인에 성공하였습니다.');
      window.location.href = 'http://localhost:3000/main';
    },
    error: (jqXHR, textStatus, errorThrown) => {
      // 요청이 실패했을 때의 처리
      const errorMessage = jqXHR.responseJSON
        ? jqXHR.responseJSON.message
        : '로그인에 실패했습니다.';
      alert(errorMessage); // 에러 메시지를 알림창으로 표시
      console.error(errorMessage); // 콘솔에 에러 메시지 출력
    },
  });
});
