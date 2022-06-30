import { Router } from "express";
const router = Router();
import passport from "passport";


router.get('/google/failure', (req, res) => {
    res.status(401).json({
        error: true,
        message: 'Google authentication failed'
    });
});

router.get("/google/success", (req, res) => {
    if (req.user)
        res.status(200).json({ error: false, message: "Google authentication success", user: req.user });
    else
        res.status(401).json({ error: true, message: "Google authentication failed" });
})

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: '/login/failure',
    }));


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/logout", (req, res) => {
    req.logout(() => res.redirect(process.env.CLIENT_URL || "http://localhost:3000"))
})

export default router;