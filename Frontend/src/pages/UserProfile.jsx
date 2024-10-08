import { useSelector } from "react-redux"
import { UserAvatar } from "../cmps/UserAvatar"
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ErrorPage } from "./ErrorPage"
import { userService } from "../services/user.service"
import { Skeleton } from "antd"
import { MdAddAPhoto } from "react-icons/md"
import CloudinaryUpload from "../cmps/CloudinaryUpload"
import { editUser } from "../store/user.actions"
import { showSuccessMsg } from "../services/event-bus.service"
import { useDocumentTitle } from "../customHooks/useDocumentTitle"
export function UserProfile() {
    useDocumentTitle(`Profile | Pyello`)
    const params = useParams()
    const user = useSelector((state) => state.userModule.user)
    const [currentUser, setCurrentUser] = useState({})
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (params.all) {
            navigate(`/u/${params.userName}`)
        }
    }, [params])
    useEffect(() => {
        if (params.userName && user) {
            if (params.userName === user.username) {
                setCurrentUser(user)
                setIsLoaded(true)
            } else {
                getUser(params.userName)
            }
        }
    }, [params.userName, user])

    const navList = [
        {
            label: "Profile and visibility",
            to: `/u/${user?.username}`,
            visible: params.userName === user?.username,
        },
        // { label: "Cards", to: `/u/${user?.username}/cards`, visible: true },
    ]
    async function getUser(username) {
        setIsLoaded(false)
        try {
            const foundUser = await userService.getByUserName(username)
            if (foundUser) {
                setCurrentUser(foundUser)
            } else {
                setCurrentUser(null)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoaded(true)
        }
    }

    function uploadPhoto(data) {
        console.log(data.secure_url)
        editUser({ ...user, imgUrl: data.secure_url })
        showSuccessMsg("Success")
    }
    return (
        <>
            {isLoaded ? (
                <>
                    {currentUser?.id ? (
                        <section className="user-profile">
                            <header className="header-members-details">
                                {currentUser.id === user.id ? (
                                    <CloudinaryUpload
                                        onAttachUrl={uploadPhoto}
                                        anchorEl={
                                            <span className="change-img">
                                                <UserAvatar
                                                    size={48}
                                                    memberProp={currentUser}
                                                    className="img"
                                                />
                                                <MdAddAPhoto className="icon" />
                                            </span>
                                        }
                                    />
                                ) : (
                                    <UserAvatar
                                        size={48}
                                        memberProp={currentUser}
                                        className="img"
                                    />
                                )}
                                <div className="member-name">
                                    <h1 className="full-name">
                                        {currentUser?.fullName}
                                    </h1>
                                    <p className="user-name">
                                        @{currentUser?.username}
                                    </p>
                                </div>
                            </header>
                            <nav className="navigation">
                                <ul className="navigation-list">
                                    {navList.map((li) => {
                                        if (!li.visible) return
                                        return (
                                            <li key={li.label}>
                                                <NavLink
                                                    to={li.to}
                                                    className="nav-item"
                                                    end
                                                >
                                                    {li.label}
                                                </NavLink>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>

                            <main className="information">
                                <Outlet />
                            </main>
                        </section>
                    ) : (
                        <ErrorPage />
                    )}
                </>
            ) : (
                <section className="user-profile">
                    <Skeleton />
                </section>
            )}
        </>
    )
}
