// import React from "react";

// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import AuthForm from "./AuthForm";

// const Auth = () => {
// 	const navigate = useNavigate();

// 	return (
// 		<div
// 			className="min-h-screen flex flex-col relative overflow-hidden"
// 			style={{
// 				backgroundImage:
// 					"url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
// 				backgroundSize: "cover",
// 				backgroundPosition: "center",
// 			}}
// 		>
// 			{/* Overlay */}
// 			<div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>

// 			{/* Top Navigation */}
// 			<div className="relative z-10 flex justify-between items-center p-6">
// 				<Button
// 					variant="ghost"
// 					size="icon"
// 					onClick={() => navigate("/")}
// 					className="hover:bg-accent animate-fade-in"
// 				>
// 					<ArrowLeft className="h-5 w-5" />
// 				</Button>

// 				<div className="flex items-center space-x-2 animate-fade-in">
// 					<div className="text-foreground font-bold text-xl">
// 						Georgina Services Limited
// 					</div>
// 				</div>
// 			</div>

// 			{/* Main Content */}
// 			<div className="flex-grow flex items-center justify-center px-4 relative z-10">
// 				<div className="w-full max-w-md">
// 					<AuthForm />
// 				</div>
// 			</div>

// 			{/* Footer */}
// 			<footer className="relative z-10 p-6 text-center text-muted-foreground text-sm animate-fade-in">
// 				<p>© 2025 Georgina Services Limited. All rights reserved.</p>
// 			</footer>
// 		</div>
// 	);
// };

// export default Auth;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthForm from "./AuthForm";

const Auth = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative bg-background overflow-x-hidden">
            {/* Left Side: Ankara Banner */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-stone-900 text-white">
                {/* Background Ankara Image */}
                <img
                    src="https://images.pexels.com/photos/12477588/pexels-photo-12477588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Ankara fashion banner"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                
                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

                {/* Top Back Navigation inside Banner */}
                <div className="relative z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/")}
                        className="text-white hover:bg-white/20 rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </div>

                {/* Banner Content / Catchphrase */}
                <div className="relative z-10 max-w-lg mb-8">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/80 mb-3">
                        Georgina Services Limited
                    </p>
                    <h1 className="font-serif text-4xl xl:text-5xl leading-tight mb-4">
                        Bold prints, sharp cuts, timeless elegance.
                    </h1>
                    <p className="text-white/80 text-sm xl:text-base">
                        Sign in or create an account to explore our latest Ankara collections, track orders, and experience personalized styling.
                    </p>
                </div>

                {/* Banner Footer */}
                <div className="relative z-10 text-xs text-white/60">
                    <p>© 2025 Georgina Services Limited. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side: Authentication Form Area */}
            <div className="flex flex-col justify-between min-h-screen lg:min-h-0 p-6 sm:p-12 relative bg-background">
                {/* Mobile Header / Back Button (visible only on mobile) */}
                <div className="flex justify-between items-center lg:hidden w-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/")}
                        className="hover:bg-accent"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="text-foreground font-bold text-lg">
                        Georgina Services Limited
                    </div>
                </div>

                {/* Spacer or empty div to push form towards center on desktop */}
                <div className="hidden lg:block" />

                {/* Main Auth Form Container */}
                <div className="w-full max-w-md mx-auto my-auto py-8">
                    <AuthForm />
                </div>

                {/* Footer for Mobile */}
                <footer className="text-center text-muted-foreground text-xs lg:hidden mt-auto pt-6">
                    <p>© 2025 Georgina Services Limited. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Auth;
