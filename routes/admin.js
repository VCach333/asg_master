const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const multer = require('multer')

/* Conf. da Rota */
const router = express.Router()

/* Importando Arquivos */
require('../models/Crono')
require('../models/User')
require('../models/Categoria')
require('../models/Prod')


const db = require('../config/db')
const Crono = mongoose.model('cronos')
const User = mongoose.model('users')
const Categoria = mongoose.model('cats')
const Prod = mongoose.model('prods')
const { isAdmin } = require('../helpers/funcs')

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/img/corpo/')
    },
    filename: function (req, file, callback) {

        const extensao = file.originalname.split('.')[1]

        const newName = file.originalname

        callback(null, `${newName}`)
    }
})

var upload = multer({ storage: storage })

function globalDate(how) {
    var day = new Date().getDate()
    if (Number(day) < 10) { day = '0' + day }
    var dayS = new Date().getDay().toString().replace('0', 'Dom').replace('1', 'Seg').replace('2', 'Ter').replace('3', 'Qua').replace('4', 'Qui').replace('5', 'Sex').replace('6', 'Sáb')
    var _month = new Date().getMonth()
    var month = Number(_month + 1)
    var monthS = month.toString().replace('1', 'Jan').replace('2', 'Fev').replace('3', 'Mar').replace('4', 'Abr').replace('5', 'Mai').replace('6', 'Jun').replace('7', 'Jul').replace('8', 'Ago').replace('9', 'Set').replace('10', 'Out').replace('11', 'Nov').replace('12', 'Dez')
    var year = new Date().getFullYear()
    var hour = new Date().getHours()
    var minute = new Date().getMinutes()
    var seconds = new Date().getSeconds()


    if (how == 'hour') {
        var global_date = hour + ':' + minute + ':' + seconds
    } else if (how == 'vsmall') {
        var global_date = day + ' · ' + month + ' · ' + year
    } else if (how == 'small') {
        var global_date = day + ' · ' + month + ' · ' + year + ' | ' + hour
    } else if (how == 'medium') {
        var global_date = dayS + ' · ' + day + ' · ' + monthS + ' · ' + year + ' | ' + hour + 'h'
    } else if (how == 'large') {
        var global_date = dayS + ' · ' + day + ' · ' + monthS + ' · ' + year + ' | ' + hour + ':' + minute
    }

    return global_date
}

router.get('/cronologia', isAdmin, (req, res) => {
    Crono.find().sort({ _date: 'desc' }).lean().then((cronos) => {
        Crono.find().count().lean().then((cronos_count) => {
            res.render('admin/cronologia', { cronos: cronos, cronos_count: cronos_count, admin: 'admin' })
        }).catch((err) => {
            console.error('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/user/perfil')
        })
    }).catch((err) => {
        console.error('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/user/perfil')
    })
})

router.post('/cronologia/empy', isAdmin, (req, res) => {
    Crono.deleteMany().then(() => {
        req.flash('success_msg', 'Cronologia Esvaziada')
        res.redirect('/admin/cronologia')
    }).catch((err) => {
        console.error('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/admin/cronologia')
    })
})

router.get('/users', isAdmin, (req, res) => {
    User.find({ mode: 'admin' }).sort({ date: 'desc' }).lean().then((admins) => {
        User.find({ mode: 'admin' }).count().lean().then((admins_count) => {
            User.find({ mode: 'user' }).sort({ date: 'desc' }).lean().then((users) => {
                User.find({ mode: 'user' }).count().lean().then((users_count) => {
                    User.find({ mode: 'user', status: 'online' }).count().lean().then((users_online_count) => {
                        res.render('admin/users', { admin: 'admin', users: users, users_count: users_count, admins: admins, admins_count: admins_count, users_online_count: users_online_count })
                    }).catch((err) => {
                        console.error('Houve um Erro - ' + err)
                        req.flash('error_msg', 'Houve um Erro')
                        res.redirect('/user/perfil')
                    })
                }).catch((err) => {
                    console.error('Houve um Erro - ' + err)
                    req.flash('error_msg', 'Houve um Erro')
                    res.redirect('/user/perfil')
                })
            }).catch((err) => {
                console.error('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/user/perfil')
            })
        }).catch((err) => {
            console.error('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/user/perfil')
        })
    }).catch((err) => {
        console.error('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/user/perfil')
    })
})

router.post('/user/delete/:ident', isAdmin, (req, res) => {
    User.deleteOne({ ident: req.params.ident }).then(() => {
        Crono.find().count().then((crono_qtd) => {
            const crono_cad = {
                acao: 'Admin Baniu Usuário',
                autor: req.user.ident,
                desc: 'Admin ' + req.user.nome + ' Baniu Usuário ' + req.params.ident + ' - ' + req.body.nome,
                num: Number(crono_qtd + 1),
                date: globalDate('large'),
                _date: Date.now()
            }

            new Crono(crono_cad).save().then(() => {
                req.flash('success_msg', 'Usário Deletado')
                res.redirect('/admin/users')
            }).catch((err) => {
                console.log('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/admin/user/cadastro')
            })
        }).catch((err) => {
            console.log('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/admin/users')
        })

    }).catch((err) => {
        console.error('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/admin/users')
    })
})

router.post('/cadastro/admin/:ident', isAdmin, (req, res) => {
    User.findOne({ ident: req.params.ident }).then((user) => {
        user.mode = 'admin'

        user.save().then(() => {
            Crono.find().count().then((crono_qtd) => {
                const crono_cad = {
                    acao: 'Admin Promoveu Admin',
                    autor: req.user.ident,
                    desc: 'Admin ' + req.user.nome + ' Promoveu ' + req.params.ident + ' - ' + req.body.nome + ' como Administrador',
                    num: Number(crono_qtd + 1),
                    date: globalDate('large'),
                    _date: Date.now()
                }

                new Crono(crono_cad).save().then(() => {
                    req.flash('success_msg', 'Privilégios de Admin Adicionados')
                    res.redirect('/admin/users')
                }).catch((err) => {
                    console.log('Houve um Erro - ' + err)
                    req.flash('error_msg', 'Houve um Erro')
                    res.redirect('/admin/user/cadastro')
                })
            }).catch((err) => {
                console.log('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/admin/users')
            })
        }).catch((err) => {
            console.error('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/admin/users')
        })
    }).catch((err) => {
        console.error('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/admin/users')
    })
})

router.post('/delete/admin/:ident', isAdmin, (req, res) => {
    if (req.params.ident == 'admin_exclusivo_ident') {
        Crono.find().count().then((crono_qtd) => {
            const crono_cad = {
                acao: 'Tentativa de Remover Admin Exclusivo',
                autor: req.user.ident,
                desc: 'Admin ' + req.user.nome + ' Tentou Remover Privilégios de Administrador ao Admin Exclusivo ' + req.params.ident + ' - ' + req.body.nome,
                num: Number(crono_qtd + 1),
                date: globalDate('large'),
                _date: Date.now()
            }

            new Crono(crono_cad).save().then(() => {
                console.log('Tentativa de Remover Admin Exclusivo!!!')
                console.log(req.user)
                res.redirect('/')
            }).catch((err) => {
                console.log('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/admin/user/cadastro')
            })
        }).catch((err) => {
            console.log('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/admin/users')
        })

    } else {
        User.findOne({ ident: req.params.ident }).then((user) => {
            user.mode = 'user'

            user.save().then(() => {
                Crono.find().count().then((crono_qtd) => {
                    const crono_cad = {
                        acao: 'Admin Removeu Admin',
                        autor: req.user.ident,
                        desc: 'Admin ' + req.user.nome + ' Removeu os Privilégios de Administrador a ' + req.params.ident + ' - ' + req.body.nome,
                        num: Number(crono_qtd + 1),
                        date: globalDate('large'),
                        _date: Date.now()
                    }

                    new Crono(crono_cad).save().then(() => {
                        req.flash('success_msg', 'Privilégios de Admin Removidos')
                        res.redirect('/admin/users')
                    }).catch((err) => {
                        console.log('Houve um Erro - ' + err)
                        req.flash('error_msg', 'Houve um Erro')
                        res.redirect('/admin/user/cadastro')
                    })
                }).catch((err) => {
                    console.log('Houve um Erro - ' + err)
                    req.flash('error_msg', 'Houve um Erro')
                    res.redirect('/admin/users')
                })

            }).catch((err) => {
                console.error('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/admin/users')
            })
        }).catch((err) => {
            console.error('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/admin/users')
        })
    }
})

router.get('/categorias/cadastro', isAdmin, (req, res) => {
    res.render('admin/cat_cad', { admin: 'admin' })
})

router.post('/categorias/cadastro', isAdmin, (req, res) => {
    var erros = []

    if (!req.body.titulo || typeof req.body.titulo == undefined || typeof req.body.titulo == null) {
        erros.push({ texto: 'Título Inválido' })
    } if (req.body.titulo.length < 2) {
        erros.push({ texto: 'Título muito Curto' })
    } if (req.body.titulo.length > 30) {
        erros.push({ texto: 'Título muito Longo! Máximo 30' })
    }

    if (!req.body.desc || typeof req.body.desc == undefined || typeof req.body.desc == null) {
        erros.push({ texto: 'Descrição Inválida' })
    } if (req.body.desc.length < 10) {
        erros.push({ texto: 'Descrição muito Curta' })
    } if (req.body.desc.length > 100) {
        erros.push({ texto: 'Descrição muito Longa! Máximo 100' })
    }

    const cat_cad = {
        titulo: req.body.titulo,
        desc: req.body.desc,
        date: globalDate('large'),
        _date: Date.now()
    }

    if (erros.length > 0) {
        res.render('admin/cat_cad', { erros: erros, cat_cad: cat_cad })
    } else {
        new Categoria(cat_cad).save().then(() => {
            Crono.find().count().then((crono_qtd) => {
                const crono_cad = {
                    acao: 'Cadastro de Categoria',
                    autor: req.user.ident,
                    desc: `Admin ${req.user.nome} - ${req.user.ident} cadastrou a Categoria ${req.body.titulo}`,
                    num: Number(crono_qtd + 1),
                    date: globalDate('large'),
                    _date: Date.now()
                }

                new Crono(crono_cad).save().then(() => {
                    req.flash('success_msg', 'Categoria Cadastrada')
                    res.redirect('/categorias')
                }).catch((err) => {
                    console.log('Houve um Erro - ' + err)
                    req.flash('error_msg', 'Houve um Erro')
                    res.redirect('/categorias')
                })
            }).catch((err) => {
                console.log('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/categorias')
            })
        }).catch((err) => {
            console.log('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/categorias')
        })
    }

})

router.post('/categorias/delete/:id', isAdmin, (req, res) => {
    Categoria.deleteOne({ _id: req.params.id }).then(() => {
        Crono.find().count().then((crono_qtd) => {
            const crono_cad = {
                acao: 'Categoria Deletada',
                autor: req.user.ident,
                desc: `Admin ${req.user.nome} - ${req.user.ident} deletou a Categoria ${req.body.titulo}`,
                num: Number(crono_qtd + 1),
                date: globalDate('large'),
                _date: Date.now()
            }

            new Crono(crono_cad).save().then(() => {
                req.flash('success_msg', 'Categoria Deletada')
                res.redirect('/categorias')
            }).catch((err) => {
                console.log('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/categorias')
            })
        }).catch((err) => {
            console.log('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/categorias')
        })
    }).catch((err) => {
        console.log('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/categorias')
    })

})

router.get('/categorias/edit/:id', isAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((cat_edit) => {
        res.render('admin/cat_edit', { admin: 'admin', cat_edit: cat_edit })
    }).catch((err) => {
        console.log('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/categorias')
    })
})

router.post('/categorias/edit/:id', isAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((cat_edit) => {
        cat_edit.titulo = req.body.titulo
        cat_edit.desc = req.body.desc


        cat_edit.save().then(() => {
            Crono.find().count().then((crono_qtd) => {
                const crono_cad = {
                    acao: 'Categoria Atualizada',
                    autor: req.user.ident,
                    desc: `Admin ${req.user.nome} - ${req.user.ident} atualizaou a Categoria ${req.body.titulo}`,
                    num: Number(crono_qtd + 1),
                    date: globalDate('large'),
                    _date: Date.now()
                }

                new Crono(crono_cad).save().then(() => {
                    req.flash('success_msg', 'Categoria Atualizada')
                    res.redirect('/categorias')
                }).catch((err) => {
                    console.log('Houve um Erro - ' + err)
                    req.flash('error_msg', 'Houve um Erro')
                    res.redirect('/categorias')
                })
            }).catch((err) => {
                console.log('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/categorias')
            })
        }).catch((err) => {
            console.log('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/categorias')
        })

    }).catch((err) => {
        console.log('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/categorias')
    })

})

router.get('/produtos/cadastro', isAdmin, (req, res) => {
    Categoria.find().sort({_date:'desc'}).lean().then((cats) => {
        res.render('admin/prod_cad', { admin: 'admin', cats: cats })
    }).catch((err) => {
        console.log('Houve um Erro - ' + err)
        req.flash('error_msg', 'Houve um Erro')
        res.redirect('/produtos')
    })
})

router.post('/produtos/cadastro', isAdmin, upload.single('foto'), (req, res) => {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || typeof req.body.nome == null) {
        erros.push({ texto: 'Nome Inválido' })
    } if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome muito Curto' })
    } if (req.body.nome.length > 30) {
        erros.push({ texto: 'Nome muito Longo! Máximo 30' })
    }

    if (!req.body.categoria || typeof req.body.categoria == undefined || typeof req.body.categoria == null) {
        erros.push({ texto: 'Categoria Inválida' })
    }

    if (!req.body.preco || typeof req.body.preco == undefined || typeof req.body.preco == null || isNaN(req.body.preco)) {
        erros.push({ texto: 'Preço Inválido' })
    } if (req.body.preco.length < 4) {
        erros.push({ texto: 'Preço muito Curto' })
    } if (req.body.preco.length > 7) {
        erros.push({ texto: 'Preço muito Longo! Máximo 7' })
    }

    if (!req.body.stock || typeof req.body.stock == undefined || typeof req.body.stock == null || isNaN(req.body.stock)) {
        erros.push({ texto: 'Stock Inválido' })
    }

    const prod_cad = {
        foto: req.body.fotoText || 'logo.png',
        nome: req.body.nome,
        categoria: req.body.categoria,
        cores: req.body.cores,
        preco: req.body.preco,
        stock: req.body.stock,
        date: globalDate('large'),
        _date: Date.now()
    }

    if (erros.length > 0) {
        res.render('admin/prod_cad', { erros: erros, prod_cad: prod_cad })
    } else {
        new Prod(prod_cad).save().then(() => {
            Crono.find().count().then((crono_qtd) => {
                const crono_cad = {
                    acao: 'Cadastro de Produto',
                    autor: req.user.ident,
                    desc: `Admin ${req.user.nome} - ${req.user.ident} cadastrou a Produto ${req.body.nome}`,
                    num: Number(crono_qtd + 1),
                    date: globalDate('large'),
                    _date: Date.now()
                }

                new Crono(crono_cad).save().then(() => {
                    req.flash('success_msg', 'Produto Cadastrado')
                    res.redirect('/produtos')
                }).catch((err) => {
                    console.log('Houve um Erro - ' + err)
                    req.flash('error_msg', 'Houve um Erro')
                    res.redirect('/produtos')
                })
            }).catch((err) => {
                console.log('Houve um Erro - ' + err)
                req.flash('error_msg', 'Houve um Erro')
                res.redirect('/produtos')
            })
        }).catch((err) => {
            console.log('Houve um Erro - ' + err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/produtos')
        })
    }

})

module.exports = router