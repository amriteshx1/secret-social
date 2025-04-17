exports.getHomepage = (req, res) => {
    res.render('index', {title: 'Home'});
}

exports.getSignUp = (req,res) => {
    res.render('signup', {title : 'Sign Up'});
    res.redirect('/');
}