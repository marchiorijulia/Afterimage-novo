document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch ('http://localhost:3000/api/get/post');
    const result = await response.json();

    // console.log(result);
    if(result.success){
        const postList = document.querySelector('')
    }
});