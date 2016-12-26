var vote = (function () {
    var url = window.location.href,
        indexReg = /index/,
        registerReg = /register/,
        detailReg = /detail/,
        searchReg = /search/,
        limit = 10,
        offset = 0,
        total = 0,
        userInfo = 'userInfo',
    loadMoreFlag=false;
    return {
        init: function () {
            if (indexReg.test(url)) {
                vote.indexInit()
            } else if (registerReg.test(url)) {
                vote.registerInit()
            } else if (detailReg.test(url)) {
                vote.detailInit()
            } else if (searchReg.test(url)) {
                vote.searchInit()
            }
        },
        /*localStorage用本地存储来判断用户的登录信息*/
        setStorage: function (key, obj) {
            localStorage.setItem(key, JSON.stringify(obj))
        },
        getStorage: function (key) {
            return JSON.parse(localStorage.getItem(key))
        },
        deleteStorage: function (key) {
            return localStorage.removeItem(key)
        },
        /*登录遮罩层*/
        checkLogin: function () {
            var that = this
            var user = this.getStorage(userInfo);
            if (user) {
                $('.sign_in span').html('退出登入')
                $('.register').html('个人主页')
                $('.no_signed').hide()
                $('._username').html(user.name)
            }
            $('.sign_in').click(function (event) {
                $('.mask').show()
            });
            $('.mask').click(function (event) {
                if (event.target.className === 'mask') {
                    $(this).hide()
                }
            });
            $('.dropout').click(function (event) {
                that.deleteStorage(userInfo)
                window.location = url
            });

            $('.subbtn').click(function (event) {
                var usernum = $('.usernum').val()
                var password = $('.user_password').val()
                if (usernum === '') {
                    alert('请输入你的id号')
                    return false
                }
                if (password === '') {
                    alert('请输入密码')
                    return false
                }
                var sendData = {
                    password: password,
                    id: usernum
                };
                window.location = url
            });
        },
        /*主页初始化*/
        indexInit: function () {
            var that = this;
            this.manageVote();
            this.checkLogin();
            this.reqData('data.json', 'GET', '', function (data) {
                var lists = data.data.objects;
                total = data.data.total;
                $('.coming').html(that.getIndexUserStr(lists))
            });
            this.loadMore()
        },
        /*主页上啦加载*/
        loadMore: function () {
            var that = this
            window.onscroll = function() {
            	var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
            	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            	var realHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            	var changeHeight  = winHeight + scrollTop
            	if (changeHeight >= realHeight && !loadMoreFlag) {
            		loadMoreFlag = true
            			that.reqData('data.json', 'GET', '', function(data) {
            				var lists = data.data.objects;
            				$('.coming').append(that.getIndexUserStr(lists));
            				window.setTimeout(function () {
                                loadMoreFlag = false

                            },500)
            			})

            	}
            }

        },
        /*注册页初始化*/
        registerInit: function () {

            $('.u_btn').click(function (event) {
                window.location.href='index.html'
                /*var sendData = that.getRegisterData();
                that.reqData('/vote/register/data', "POST", sendData, function (data) {
                    if (data.errno === 0) {
                        that.setStorage(userInfo, {
                            id: data.id,
                            name: sendData.username
                        });
                        window.location = '/vote/index'
                    } else {
                        alert(data.msg)
                    }
                })*/
            });
        },
        /*获取注册信息*/
        // getRegisterData: function () {
        //     var username = $('.username').val()
        //     var initialPassword = $('.initial_password').val()
        //     var confirmPassword = $('.confirm_password').val()
        //     var mobile = $('.mobile').val()
        //     var description = $('.description').val()
        //     var gender = 'boy'
        //     if (username === "") {
        //         alert('请输入用户名')
        //         return false
        //     }
        //     if (initialPassword === "") {
        //         alert('请输入密码')
        //         return false
        //     }
        //     if (description === "") {
        //         alert('请输入描述')
        //         return false
        //     }
        //     if (initialPassword != confirmPassword) {
        //         alert('两次输入的密码不正确哦')
        //         return false
        //     }
        //     if (!/^\d{11}$/.test(mobile)) {
        //         alert('您输入的手机号码格式不正确')
        //         return false
        //     }
        //     $('input[type=radio]')[0].checked ? gender = 'boy' : gender = 'girl';
        //     return {
        //         username: username,
        //         mobile: mobile,
        //         description: description,
        //         gender: gender,
        //         password: initialPassword
        //     }
        // },
        /*详情页初始化*/
        detailInit: function () {
            var that = this
            var id = /detail\/(\d*)/.exec(url)[1];
            console.log();
            this.reqData('data.json', 'GET', '', function (data) {
                $('.personal').html(that.detailPersonalStr(data.data[10]));
                $('.vflist').html(that.detailVoterStr(data.data[0].vfriend))
            })
        },
        /*searchInit: function () {
            var content = /content=(\w*)/i.exec(url)[1]
            this.reqData('/vote/index/search?content=' + content, 'get', '', function () {

            })
        },*/
        /*data字符串拼接*/
        getIndexUserStr: function (lists) {
            var str = '';
            for (var i = 0; i < lists.length; i++) {
                str += '<li>'
                    + '<div class="head">'
                    + '   <a href="detail.html">' + lists[i].id + '>'
                    + '      <img src="' + lists[i].head_icon + '" alt="">'
                    + '   </a>'
                    + '</div>'
                    + '<div class="up">'
                    + '   <div class="vote">'
                    + '      <span>' + lists[i].vote + '票</span>'
                    + '  </div>'
                    + '   <div class="btn" data-id=' + lists[i].id + '>'
                    + '      投TA一票'
                    + '   </div>'
                    + '</div>'
                    + '<div class="descr">'
                    + '   <a href="detail.html"' + lists[i].id + '>'
                    + '     <div>'
                    + '        <span>' + lists[i].username + '</span>'
                    + '        <span>|</span>'
                    + '        <span>编号#' + lists[i].id + '</span>'
                    + '      </div>'
                    + '      <p>' + lists[i].description + '</p>'
                    + '   </a>'
                    + '</div>   '
                    + '</li>'
            }
            return str
        },
        detailPersonalStr: function (list) {
            var str = '<div class="pl">'
                + '<div class="head">'
                + '<img src="' + list.head_icon + '" alt="">'
                + '</div>'
                + '<div class="p_descr">'
                + '<p>' + list.username + '</p>'
                + '<p>编号#' + list.id + '</p>'
                + '</div>'
                + '</div>'
                + '<div class="pr">'
                + '<div class="p_descr pr_descr">'
                + '<p>' + list.rank + '名</p>'
                + '<p>' + list.vote + '票</p>'
                + '</div>'
                + '</div>'
                + '<div class="motto">'
                + '' + list.description + ''
                + '</div>';
            return str;
        },
        detailVoterStr: function (list) {
            var str = '';
            for (var i = 0; i < list.length; i++) {
                str += '<li>'
                    + '<div class="head">'
                    + '<img src="' + list[i].head_icon + '" alt="">'
                    + '</div>'
                    + '<div class="up">'
                    + '<div class="vote">'
                    + '<span>投了一票</span>'
                    + '</div>'
                    + '</div>'
                    + '<div class="descr">'
                    + '<h3>' + list[i].username + '</h3>'
                    + '<p>编号#' + list[i].id + '</p>'
                    + '</div>'
                    + '</li>'
            }
            return str;
        },
        manageVote: function () {
            var that = this;
            $(document).on('click', '.btn', function (event) {
                var user = that.getStorage(userInfo);
                var $numEle = $(event.target).siblings('.vote').children('span');
                var voteNum = parseInt($numEle.html())
                $numEle.html(++voteNum + '票')
                $numEle.addClass('bounceIn')
                /*if (user) {
                    var selfId = user.id;
                    var voterId = +$(this).attr('data-id');
                    that.reqData(' /vote/index/poll?id=' + voterId + '&voterId=' + selfId, 'GET', '', function (data) {
                        if (data.errno === 0) {
                            var $numEle = $(event.target).siblings('.vote').children('span');
                            var voteNum = parseInt($numEle.html())
                            $numEle.html(++voteNum + '票')
                            $numEle.addClass('bounceIn')
                        } else {
                            alert(data.msg)
                        }
                    })
                } else {
                    $('.mask').show()
                }*/
            });
        },
        /*ajax*/
        reqData: function (url, method, data, fn) {
            $.ajax({
                url: url,
                type: method,
                dataType: 'json',
                data: data,
                success: fn
            })
        },
    };

})();

$(document).ready(function () {
    vote.init()
});



