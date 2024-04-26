$('#registerForm').submit((event) => {
  event.preventDefault();

  const formData = {
    email: $('#email').val(),
  };

  $.ajax({
    url: 'http://localhost:3000/user/emailAuth',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(formData),
    success: (data) => {
      alert('이메일 인증 코드 전송이 완료되었습니다.');
    },
    error: (jqXHR, textStatus, errorThrown) => {
      const errorMessage = jqXHR.responseJSON
        ? jqXHR.responseJSON.message
        : '인증코드 발송에 실패하였습니다.';
      alert(errorMessage);
      console.log(errorMessage);
    },
  });
});

$('#bottomBtnForm').submit((event) => {
  event.preventDefault();

  const formData = {
    email: $('#email').val(),
    verifyToken: parseInt($('#verifyToken').val()),
    password: $('#password').val(),
    chekPassword: $('#passwd_confirm').val(),
    name: $('#name').val(),
  };

  $.ajax({
    url: 'http://localhost:3000/user/register',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(formData),
    success: (data) => {
      alert('회원가입이 완료되었습니다.');
      window.location.href = 'http://localhost:3000/user/sign-in';
    },
    error: (jqXHR, textStatus, errorThrown) => {
      const errorMessage = jqXHR.responseJSON
        ? jqXHR.responseJSON.message
        : '회원가입에 실패했습니다.';
      alert(errorMessage);
      console.log(errorMessage);
    },
  });
});
