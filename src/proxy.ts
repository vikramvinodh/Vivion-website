import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.nextUrl.hostname;

    // Checks if the hostname starts with "admin." (e.g. admin.vivion.com or admin.localhost)
    const isAdminSubdomain = hostname.startsWith('admin.');

    if (isAdminSubdomain) {
        const pathname = url.pathname;

        // Skip internal next, api and public assets
        if (
            !pathname.startsWith('/_next') &&
            !pathname.startsWith('/api') &&
            !pathname.startsWith('/favicon.ico') &&
            !pathname.startsWith('/logo.png') &&
            !pathname.startsWith('/static')
        ) {
            // Rewrite requests so the user stays on "admin.domain.com/blogs" but Next.js renders "/admin/blogs"
            if (pathname === '/login') {
                // Let /login pass through
            } else if (pathname.startsWith('/admin')) {
                // If they explicitly typed /admin/..., rewrite it to remove the /admin prefix to avoid double routing
                url.pathname = pathname.replace('/admin', '') || '/';
                return NextResponse.redirect(url);
            } else {
                // Rewrite: E.g., / -> /admin, /blogs -> /admin/blogs, /users -> /admin/users
                if (pathname === '/') {
                    url.pathname = '/admin';
                } else {
                    url.pathname = `/admin${pathname}`;
                }
                return NextResponse.rewrite(url);
            }
        }
    } else {
        // If a user goes to "yourdomain.com/admin...", redirect them to "admin.yourdomain.com"
        if (url.pathname.startsWith('/admin')) {
            const proto = request.headers.get('x-forwarded-proto') || 'http';
            // Extract the domain without any admin/www subdomain
            const cleanHost = hostname.replace(/^www\./, '');
            const newPath = url.pathname.replace('/admin', '') || '/';
            return NextResponse.redirect(`${proto}://admin.${cleanHost}${newPath}`);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. Static files (logo.png, favicon.ico)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
    ],
};
