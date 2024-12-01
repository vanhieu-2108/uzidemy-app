# Flow authen trong nextjs

- 1. Sao khi người dùng submit form bằng nhấn vào nút đăng ký
- 2. Ta sẽ có được email và password từ form gửi lên
- 3. Ta sẽ gọi api đến nextjs server và gửi email và password lên nextjs server
- 4. Ở nextjs server ta sẽ nhận được email và password sau đó goi lên api của server backend để đăng nhập
- 5. Sau khi đăng nhập thành công ta sẽ nhận được access token và refresh token từ server backend trả về
- 6. Ta sẽ lưu access token và refresh token vào cookie của nextjs client
- 7. Vậy giờ ta đã có được access token và refresh token từ client gửi lên và ta có thể gọi api từ nestjs server đến server backend còn client thì lấy từ local storage ra và gửi lên server backend
